import { qrcode } from "etiket";
import { Message, TrackCardBody, ProgrammeCardBody } from "./message.js";
import { Card } from "./card.js";
import * as config from "./config.js";

// Card components
var programmeOverlay;
var trackOverlay;

// Websocket heartbeat
const HEARTBEAT_INTERVAL = 1000 * 60 * 5; // 5 min
const HEARTBEAT_STR = "{\"action\": \"heartbeat\"}";
var heartbeatFunc;

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
    const ws = event.target;

    programmeOverlay = new Card("#programme");
    trackOverlay = new Card("#track");

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