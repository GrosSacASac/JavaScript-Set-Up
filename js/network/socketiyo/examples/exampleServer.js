import {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
	ERROR,
	DEFAULT_CHANNEL,
} from "../source/socketiyo.js";
import {createHttpServer} from "./createHttpServer.js";
import ws from "ws";

const httpServer = createHttpServer();
const socketiYoServer = attachWebSocketServer(httpServer, ws);


/* send the current time on the default channel to everyone */
setInterval(() => {
    socketiYoServer.sendAll(Date.now());
}, 1500);

/* send It is over to anyone on the game/end channel*/
setTimeout(() => {
    socketiYoServer.sendAll(`It is over`, `game/end`);
}, 10000);

socketiYoServer.on(CONNECT, socket => {
    console.log(`${socket} connected`);
    /* send welcome to the socket*/
    socketiYoServer.send(socket, {message: `welcome`});
    /* alert others as well */
    socketiYoServer.sendAllExceptOne(socket, {message: `new connection`});
});

socketiYoServer.on(DISCONNECT, socket => {
    console.log(`${socket} disconnected`);
});

socketiYoServer.on(ERROR, error => {
    console.error(error);
});

socketiYoServer.on(`game/input`, ({socket, data}) => {
    console.log(`${socket} send use ${data}`);
});
