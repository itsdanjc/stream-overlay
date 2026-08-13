import { onConnect, onMessage, onClose } from "./socket.js";
import { Card } from "./card.js";
import { Config } from "./config.js";

/** @type {WebSocket} */
var websocket;

/** @type {Config} */
var config;

function bindEvents(socket){
    websocket.onopen = e => onConnect(e, config);

    websocket.onmessage = e => onMessage(e);
    
    websocket.onclose = event => {
        onClose(event, socket => {
            websocket = socket;
            bindEvents(websocket);
        })
    };

    window.onoffline = () => websocket.close();
}

window.onload = () => {
    config = new Config(window.location.search);

    websocket = new WebSocket("wss://metadata.aiir.net/now-playing");
    bindEvents(websocket);
}