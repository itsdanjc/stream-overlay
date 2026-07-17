const CONFIG_STATION_ID = "5188";
const websocket = new WebSocket("wss://metadata.aiir.net/now-playing");

websocket.onopen = function() {
    const msg = JSON.stringify({
        action: "subscribe",
        serviceId: CONFIG_STATION_ID
    })

    websocket.send(msg)
}

websocket.onmessage = function(event){
    console.log(event);
}

websocket.onerror = function(err){
    console.error(err)
}

websocket.onclose = function(event){
    console.log(event)
}