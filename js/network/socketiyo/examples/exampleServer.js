import {attachWebSocketServer} from "../source/socketiyo.js";
import {createHttpServer} from "./createHttpServer.js";
import ws from "ws";

const httpServer = createHttpServer();
const socketiYoServer = attachWebSocketServer(httpServer, ws);


/* we are sending the current time */
setInterval(() => {
    socketiYoServer.sendAll(Date.now());
}, 1500);
