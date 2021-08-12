import {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL,
} from "../built/socketiyo.es.js";
import {
    maxClients,
    highClients,
    lowEnough,
    maxLength,
    maxChannels,
    maxChannelLength,
} from "../source/defaultOptions.js";


class WebSocketServer extends EventTarget {

}
const webSocketServer = new WebSocketServer();
async function handleConn(conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const e of httpConn) {
      e.respondWith(handle(e.request));
    }
}
  
function handle(req) {
    if (req.headers.get("upgrade") != "websocket") {
      return new Response("not trying to upgrade as websocket.");
    }
    console.log(req)
    const { websocket, response } = Deno.upgradeWebSocket(req);
    // webSocketServer.dispatchEvent(new Event("connection", websocket))
    // websocket.onopen = () => console.log("socket opened");
    // websocket.onmessage = (e) => {
    //   console.log("socket message:", e.data);
    //   websocket.send(new Date().toString());
    // };
    // websocket.onerror = (e) => console.log("socket errored:", e.message);
    // websocket.onclose = () => console.log("socket closed");
    return response;
}
  
const listener = Deno.listen({ port: 8080 });
console.log("listening on http://localhost:8080");
for await (const conn of listener) {
    handleConn(conn);
}




const socketiYoServer = attachWebSocketServer({
    webSocketServer,
    maxClients,
    highClients,
    lowEnough,
    maxLength,
    maxChannels,
    maxChannelLength,
});

useDefaultLogging({ socketiYoServer });
const closeDisconnectionDetection = useAdditionalDisconnectionDetection({ socketiYoServer });

/* send the current time on the default channel to everyone */
const intervalId = setInterval(() => {
    socketiYoServer.sendAll(Date.now());
}, 1500);

/* send It is over to anyone on the game/end channel*/
const timeoutId = setTimeout(() => {
    socketiYoServer.sendAll(`It is over`, `game/end`);
}, 10000);

socketiYoServer.on(CONNECT, socket => {
    /* send welcome to the socket*/
    socketiYoServer.send(socket, { message: `welcome` });
    /* alert others as well */
    socketiYoServer.sendAllExceptOne(socket, { message: `new connection` });
});


socketiYoServer.on(`game/input`, ({ socket, data }) => {
    console.log(`${socket} send us ${data}`);
});


/* close after one hour*/
setTimeout(() => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    closeDisconnectionDetection();
    socketiYoServer.close();
    httpServer.close();
}, 60 * 60 * 1000);
