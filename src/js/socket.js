import { qrcode } from "etiket";
import { Message, TrackCardBody, ProgrammeCardBody } from "./message.js";
import { Card } from "./card.js";
import { formatTime } from "./format.js";
import * as config from "./config.js";

// Card components
var programmeOverlay;
var trackOverlay;

// Websocket heartbeat
const HEARTBEAT_INTERVAL = 1000 * 60 * 5; // 5 min
const HEARTBEAT_STR = "{\"action\": \"heartbeat\"}";
var heartbeatFunc;

// Socket reconnect
const SOCKET_RECONNECT_DURATION = 1000 * 3; // 3 secs
const SOCKET_RECONNECT_COOLDOWN = 1000 * 60; // 30 secs
const SOCKET_RECONNECT_FAILURE = 1000 * 60 * 2.5; // 2.5 mins
var failureCount = 0;
var socketReconnectFunc;
var socketReconnectFailureFunc;

// Define exit codes
export const WEBSOCKET_EXIT_CODES = {
    1000: "",
    1001: "",
    1002: "",
    1003: "",
    1007: "",

}

/**
 * Utility function to stringify object
 * as JSON, and send message to websocket.
 * @param {WebSocket} ws 
 * @param {*} obj 
 */
function sendMessage(ws, obj){
    const msgStr = JSON.stringify(obj)
    ws.send(msgStr)
}

/**
 * 
 * @param {URL | string} url 
 * @returns {Blob}
 */
function createQRBlob(url){
    if (url instanceof URL)
        url = url.toJSON();

    const qrBinArr = qrcode(url, {
        size: 120,
    });

    return new Blob([...qrBinArr], {
        type: "image/svg+xml"
    });
}

/**
 * Handler for websocket connection event.
 * @param {Event} event 
 */
export function onConnect(event){
    console.log("Connected to Aiir.")
    const ws = event.target;

    // Define overlays, only if it is undefined.
    if (!programmeOverlay) programmeOverlay = new Card("#programme");
    if (!trackOverlay) trackOverlay = new Card("#track");
    
    // Clear reconnect intervals if defined.
    clearInterval(socketReconnectFunc);
    clearTimeout(socketReconnectFailureFunc);

    sendMessage(ws, {
        action: "subscribe",
        serviceId: config.stationId
    });

    heartbeatFunc = setInterval(
        () => ws.send(HEARTBEAT_STR),
        HEARTBEAT_INTERVAL
    );
}

/**
 * Handler for websocket message event.
 * @param {MessageEvent} event 
 */
export async function onMessage(event){
    const msgJson = JSON.parse(event.data);
    const msg = Message(msgJson);

    if(config.useQR && msg.track){
        if(msg.track.appleMusicUrl){
            msg.track.imageUrl = createQRBlob(
                msg.track.appleMusicUrl
            );
        } else {
            msg.track.imageUrl = msg.programme.imageUrl;
        }
    }

    const trackBody = msg.track 
        ? TrackCardBody(msg.track) 
        : config.placeholders.track
    ;
    const programmeBody = msg.programme
        ? ProgrammeCardBody(msg.programme)
        : config.placeholders.programme
    ;

    // Wrapper around Card.update
    async function updateCard(card, body){
        if (!body){
            await card.hide();
            return;
        }

        if (!card.isEqual(body)){
            await card.update(body);
        }
    }

    updateCard(trackOverlay, trackBody);
    updateCard(programmeOverlay, programmeBody);
}

/**
 * 
 * @param {CloseEvent} event 
 * @param {(socket: WebSocket) => void} callback 
 */
export async function onClose(event, callback){
    var socket = event.target;

    if (socket.readyState !== WebSocket.CLOSED)
        throw new Error("Close event called, but socket not closed.");

    clearInterval(heartbeatFunc);

    // If code is 1000 (Normal closure). Do not attempt to reconnect,
    // and hide overlays instead.
    if (event.code === 1000){
        console.log("Websocket closed normally, no action taken.");
        programmeOverlay.hide();
        trackOverlay.hide();
        return;
    }

    // Will make an attempt to reconnect to the WebSocket API.
    // Runs:
    //  -   3 Seconds after disconnection.
    //  -   Every 60 seconds since disconnection.
    //  -   By Navigator.Online event handler.
    //
    // The intervals created which run this function are cancelled,
    // by onConnect event handler.
    const reconnect = () => {
        console.log(`Attempting to reconnect...`)

        try{
            socket = new WebSocket(event.target.url);
        }
        catch {
            console.log(`Failed to connect.`)
            return;
        }

        callback(socket);
    }

    if (window.navigator.onLine){
        console.warn(
            `WebSocket closed with code ${event.code}: ${event.reason}. `,
            "Will attempt to reconnect regularly."
        );

        window.removeEventListener("online", reconnect)
        setTimeout(reconnect, SOCKET_RECONNECT_DURATION);
        socketReconnectFunc = setInterval(reconnect, SOCKET_RECONNECT_COOLDOWN);
    }
    else {
        console.warn(`Device offline, waiting for reconnection...`);
        window.addEventListener("online", reconnect)
    }
    
    // After being offline for longer than 2.5 mins,
    // the content displayed on screen will be outdated.
    // This timeout will switch the overlays to their
    // placeholder messages.
    socketReconnectFailureFunc = setTimeout(() => {
        console.log("Disconnected for longer that 2.5 minutes. Showing fallback.");

        if (config.placeholders.track){
            trackOverlay.update(config.placeholders.track);
        } else {
            trackOverlay.hide();
        }

        if (config.placeholders.programme){
            programmeOverlay.update(config.placeholders.programme);
        } else {
            programmeOverlay.hide();
        }
    }, SOCKET_RECONNECT_FAILURE);
}