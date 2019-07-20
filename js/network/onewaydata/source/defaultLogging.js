export { useDefaultLogging };
import {
    RECONNECT,
    CONNECT,
    DISCONNECT,
} from "./onewaydata.js";


const useDefaultLogging = ({ eventStream, logger = console }) => {
    eventStream.on(CONNECT, () => {
        logger.log(`someone connected`);
    });
    eventStream.on(DISCONNECT, () => {
        logger.log(`someone disconnected`);
    });
    eventStream.on(RECONNECT, ({lastId}) => {
        logger.log(`reconnected with lastId: ${lastId}`);
    });
};
