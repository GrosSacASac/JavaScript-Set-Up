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
import {useDefaultLogging,} from "../source/defaultLogging.js";
import { useAdditionalDisconnectionDetection } from "../extensions/disconnectionDetection.js";
class WebSocketServer extends EventTarget {
    constructor (options = { port: 8080 })  {
        super();
        this.listen(options);
        
    }
    async listen (options) {
        
        const listener = Deno.listen(options);
        console.log(`listening on http://localhost:${options.port}`);
        for await (const conn of listener) {
            this.handleConn(conn);
        }
    }

    handle(req) {
        if (req.headers.get("upgrade") !== "websocket") {
          return new Response("not trying to upgrade as websocket.");
        }
        
        const x = Deno.upgradeWebSocket(req);
        const { response} = x;
        const websocket = x.socket;
        if (!websocket) {
            return response;
        }
        websocket.on = websocket.addEventListener
        
        this.dispatchEvent(new CustomEvent(`connection`, {detail: websocket}));
        websocket.onopen = () => {
            
            console.log("socket opened");
        }
        // websocket.onmessage = (e) => {
        //   console.log("socket message:", e.data);
        //   websocket.send(new Date().toString());
        // };
        websocket.onerror = (e) => console.log("socket errored:", e.message);
        // websocket.onclose = () => console.log("socket closed");
        return response;
    }

    async handleConn(conn) {
        const httpConn = Deno.serveHttp(conn);
        for await (const e of httpConn) {
          e.respondWith(this.handle(e.request));
        }
    }
      
    close() {

    }

    on(eventName, callback) {
        this.addEventListener(eventName, callback);
    }
}
const webSocketServer = new WebSocketServer();


  





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
}, 5000);

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
