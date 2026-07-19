import { Message } from "./message.js";
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

    const track = msg.track ? {
        line_1: "Now Playing",
        line_2: msg.track.title ?? "Unknown Song",
        line_3: msg.track.artist ?? "Unknown Artist",
        thumbnail: msg.track.imageUrl
    } : config.placeholders.track

    const programme = msg.programme ? {
        line_1: "Live Now",
        line_2: msg.programme.name ?? "Unknown Programme",
        line_3: msg.programme.artist ?? "24/7 Hits",
        thumbnail: msg.programme.imageUrl
    } : config.placeholders.programme;


    if(!trackOverlay.isEqual(track))
        trackOverlay.update(track);

    if(!programmeOverlay.isEqual(programme))
        programmeOverlay.update(programme);
}