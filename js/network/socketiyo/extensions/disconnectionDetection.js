export { useAdditionalDisconnectionDetection };

import {
    RECEIVE_MESSAGE,
    RECEIVE_SUBSCRIBE,
    RECEIVE_UNSUBSCRIBE,
    PONG,
    LAST_CONNECTION_CHECK,
} from "../source/eventNames.js";


const markSocketLastConnectionCheck = socket => {
    socket[LAST_CONNECTION_CHECK] = Date.now();
};

const markSocketLastConnectionCheckAdapter = ({ socket }) => {
    markSocketLastConnectionCheck(socket);
};

const useAdditionalDisconnectionDetection = ({
    socketiYoServer,
    disconnectionCheckInterval = 20000, /* the smaller, the faster disconnection are detected
    at a cost of bandwidth and cpu */
    maximumTimeWithoutAsnwer = 2 * disconnectionCheckInterval,
}) => {
    /* slightly less to check, (setInterval is slightly time volatile) */
    const minimumTimeBetweenChecks = Math.round(0.9 * disconnectionCheckInterval);

    socketiYoServer.on(RECEIVE_MESSAGE, markSocketLastConnectionCheckAdapter);
    socketiYoServer.on(RECEIVE_SUBSCRIBE, markSocketLastConnectionCheckAdapter);
    socketiYoServer.on(RECEIVE_UNSUBSCRIBE, markSocketLastConnectionCheckAdapter);
    socketiYoServer.on(PONG, markSocketLastConnectionCheckAdapter);

    const intervalId = setInterval(() => {
        const now = Date.now();
        socketiYoServer.connectionsPool.forEach(socket => {
            const timePassed = now - socket[LAST_CONNECTION_CHECK];
            if (timePassed < minimumTimeBetweenChecks) {
                return;
            }
            if (timePassed > maximumTimeWithoutAsnwer) {
                socket.close();
                return;
            }
            socket.ping();
        });
    }, disconnectionCheckInterval);

    const close = () => {
        clearInterval(intervalId);
    };

    return close;
};
