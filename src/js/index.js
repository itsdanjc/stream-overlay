import { onConnect, onMessage } from "./socket.js";
import { Card } from "./card.js";
import * as config from "./config.js";

var websocket;

function initWebsocket(event){
    if(event instanceof CloseEvent){
        // Event: Websocket reconnect.
        console.log("Reconnecting to Websocket...")
    }

    else {
        // Event: Window load.
        console.log("Connecting to Aiir metadata")
    }

    websocket = new WebSocket("wss://metadata.aiir.net/now-playing");
    
    websocket.onopen = onConnect;
    websocket.onmessage = onMessage;
    websocket.onclose = initWebsocket;
}

window.onload = initWebsocket;