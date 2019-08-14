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
import { useAdditionalDisconnectionDetection } from "../source/disconnectionDetection.js";
import { createHttpServer } from "./createHttpServer.js";
import ws from "ws";
import { encode, decode } from "majo-ubjson";
import { writeTextInFile } from "filesac";

const httpServer = createHttpServer();
const socketiYoServer = attachWebSocketServer({
    httpServer,
    ws,
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
