import { Message } from "./message.js";
import { Card } from "./components.js";
import * as config from "./config.js";

const CONFIG_STATION_ID = "5188";
const websocket = new WebSocket("wss://metadata.aiir.net/now-playing");

const trackOverlay = new Card("#track");
const programmeOverlay = new Card("#programme");

websocket.onopen = function() {
    const msg = JSON.stringify({
        action: "subscribe",
        serviceId: CONFIG_STATION_ID
    })

    websocket.send(msg)
}

websocket.onmessage = function(event){
    const msgJson = JSON.parse(event.data);
    console.log(msgJson)

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

websocket.onerror = function(err){
    console.error(err)
}

websocket.onclose = function(event){
    console.log(event)
}