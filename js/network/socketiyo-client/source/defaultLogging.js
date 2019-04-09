export {useDefaultLogging};
import {
	RECONNECTING,
    CONNECT,
    DISCONNECT,
	ERROR,
} from "./socketiyo-client.js";


const useDefaultLogging = ({socketiyoConnection, logger=console}) => {
    socketiyoConnection.on(RECONNECTING, () => {
		logger.log(`reconnecting`)
    });

    socketiyoConnection.on(DISCONNECT, x => {
        logger.log(`connection closed`);
        logger.debug(x);
    });

    socketiyoConnection.on(ERROR, error => {
        logger.error(error);
    });

    socketiyoConnection.on(CONNECT, () => {
        logger.log(`connection opened`);
    });
    

    // candidates
    /*
        logger.debug(`received message ${x}`);
		logger.log(`subscribing to channel ${eventName}`);
		logger.log(`unsubscribing from channel ${eventName}`);
    */
};