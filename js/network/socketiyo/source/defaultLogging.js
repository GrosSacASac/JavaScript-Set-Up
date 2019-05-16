export { useDefaultLogging };
import {
    CONNECT,
    DISCONNECT,
    ERROR,
    OVER_LOAD,
    MESSAGE_FORMAT_ERROR,
    VALIDATE_CHANNEL_ERROR,
    VALIDATE_MESSAGE_ERROR,
    MAX_CHANNELS_ERROR,
} from "./socketiyo.js";


const useDefaultLogging = ({ socketiYoServer, logger = console }) => {
    socketiYoServer.on(CONNECT, socket => {
        logger.log(`${socket} connected`);
    });

    socketiYoServer.on(DISCONNECT, socket => {
        logger.log(`${socket} disconnected`);
    });

    socketiYoServer.on(ERROR, error => {
        logger.error(error);
    });

    socketiYoServer.on(OVER_LOAD, maxClients => {
        logger.warn(`Server reached connection limit: ${maxClients},
         dropping websocket client`);
    });

    socketiYoServer.on(VALIDATE_MESSAGE_ERROR, error => {
        logger.warn(error);
    });

    socketiYoServer.on(MESSAGE_FORMAT_ERROR, ({ error, message }) => {
        logger.warn(`invalid data received: ${error}`);
        logger.debug(message);
    });

    socketiYoServer.on(VALIDATE_CHANNEL_ERROR, error => {
        logger.warn(error);
    });

    socketiYoServer.on(MAX_CHANNELS_ERROR, maxChannels => {
        logger.warn(`Client reached max channels subscription: ${maxChannels}`);
    });

    /* candidates for future logging
    logger.log(`subscribing to channel ${channel}`);
    logger.log(`unsubscribing to channel ${channel}`);
    logger.log(`receiving data: ${parsed}`);
    */
};
