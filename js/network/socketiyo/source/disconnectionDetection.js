export { useAdditionalDisconnectionDetection };

import {
    RECEIVE_MESSAGE,
    RECEIVE_SUBSCRIBE,
    RECEIVE_UNSUBSCRIBE,
    LAST_CONNECTION_CHECK,
} from "./socketiyo.js";


const markSocketLastConnectionCheck = socket => {
    socket[LAST_CONNECTION_CHECK] = Date.now()
};

const markSocketLastConnectionCheckAdapter = ({ socket }) => {
    markSocketLastConnectionCheck(socket);
};

const useAdditionalDisconnectionDetection = ({
    socketiYoServer,
    disconnectionCheckInterval = 20000, /* the smaller, the faster disconnection are detected
    at a cost of bandwidth and cpu */
}) => {
    /* slightly less to check every time, (setInterval is slightly time volatile) */
    const minimumTimeBetweenChecks = Math.round(0.9 * disconnectionCheckInterval);

    socketiYoServer.on(RECEIVE_MESSAGE, markSocketLastConnectionCheckAdapter);
    socketiYoServer.on(RECEIVE_SUBSCRIBE, markSocketLastConnectionCheckAdapter);
    socketiYoServer.on(RECEIVE_UNSUBSCRIBE, markSocketLastConnectionCheckAdapter);

    const intervalId = setInterval(() => {
        const now = Date.now();
        socketiYoServer.connectionsPool.forEach(socket => {
            const timePassed = now - socket[LAST_CONNECTION_CHECK];
        });
        if (timePassed < minimumTimeBetweenChecks) {
            return;
        }
        // todo check, ping
    }, disconnectionCheckInterval);
};
