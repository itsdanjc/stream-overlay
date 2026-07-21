import { onConnect, onMessage, onClose } from "./socket.js";
import { Card } from "./card.js";
import * as config from "./config.js";

/** @type {WebSocket} */
var websocket;

function bindEvents(socket){
    websocket.onopen = onConnect;
    websocket.onmessage = onMessage;
    
    websocket.onclose = event => {
        onClose(event, socket => {
            websocket = socket;
            bindEvents(websocket);
        })
    };

    window.onoffline = () => websocket.close();
}

window.onload = () => {
    websocket = new WebSocket("wss://metadata.aiir.net/now-playing");
    bindEvents(websocket);
}