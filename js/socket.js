import { Message } from "./message.js";
import { Card } from "./components.js";
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

    console.log(msg)

    const track = msg.track ? {
        line_1: "Now Playing",
        line_2: msg.track.title ?? "Unknown Song",
        line_3: msg.track.artist ?? "Unknown Artist"
    } : {
        line_1: config.placeholders.track.line_1,
        line_2: config.placeholders.track.line_2,
        line_3: config.placeholders.track.line_3,
    };

    const programme = msg.programme ? {
        line_1: "Live Now",
        line_2: msg.programme.name ?? "Unknown Programme",
        line_3: msg.programme.artist ?? "24/7 Hits"
    } : {
        line_1: config.placeholders.programme.line_1,
        line_2: config.placeholders.programme.line_2,
        line_3: config.placeholders.programme.line_3,
    };

    trackOverlay.update(track);
    programmeOverlay.update(programme);
}