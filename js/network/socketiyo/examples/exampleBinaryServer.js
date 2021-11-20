import { WebSocketServer } from "ws";
import { encode, decode } from "majo-ubjson";
import { writeTextInFile } from "filesac";
import {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL,
} from "../source/socketiyo.js";
import {
    maxClients,
    highClients,
    lowEnough,
    maxLength,
    maxChannels,
    maxChannelLength,
} from "../source/defaultOptions.js";
import { useDefaultLogging } from "../source/defaultLogging.js";
import { useAdditionalDisconnectionDetection } from "../extensions/disconnectionDetection.js";
import { createHttpServer } from "./createHttpServer.js";

const httpServer = createHttpServer();
const webSocketServer = new WebSocketServer({ server: httpServer, path: undefined });
const socketiYoServer = attachWebSocketServer({
    webSocketServer,
    maxClients,
    highClients,
    lowEnough,
    maxLength,
    maxChannels,
    maxChannelLength,
    packData: (x) => {
        return encode(x, { optimizeArrays: `onlyTypedArrays` });
    },
    unpackData: (x) => {
        return decode(x, { useTypedArrays: true });
    },
});

useDefaultLogging({ socketiYoServer });
const closeDisconnectionDetection = useAdditionalDisconnectionDetection({ socketiYoServer });


socketiYoServer.on(`file/upload`, ({ socket, data }) => {
    writeTextInFile(`./upload`, data.file);
});
