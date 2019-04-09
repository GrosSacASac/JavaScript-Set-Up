import {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
	ERROR,
	DEFAULT_CHANNEL,
} from "../source/socketiyo.js";
import {
    maxClients, maxLength, maxChannels, maxChannelLength
} from "../source/defaultOptions.js";
import {useDefaultLogging} from "../source/defaultLogging";
import {createHttpServer} from "./createHttpServer.js";
import ws from "ws";


const httpServer = createHttpServer();
const socketiYoServer = attachWebSocketServer({
    httpServer,
    ws,
    maxClients, maxLength, maxChannels, maxChannelLength
});

useDefaultLogging(socketiYoServer);

/* send the current time on the default channel to everyone */
setInterval(() => {
    socketiYoServer.sendAll(Date.now());
}, 1500);

/* send It is over to anyone on the game/end channel*/
setTimeout(() => {
    socketiYoServer.sendAll(`It is over`, `game/end`);
}, 10000);

socketiYoServer.on(CONNECT, socket => {
    /* send welcome to the socket*/
    socketiYoServer.send(socket, {message: `welcome`});
    /* alert others as well */
    socketiYoServer.sendAllExceptOne(socket, {message: `new connection`});
});


socketiYoServer.on(`game/input`, ({socket, data}) => {
    console.log(`${socket} send us ${data}`);
});
