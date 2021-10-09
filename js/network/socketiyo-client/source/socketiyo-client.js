export {
    createConnection,
    RECONNECTING,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL,
};

import {
    RegularListener,
    onFirstSubscribeString,
    onLastUnsubscribeString,
} from "event-e3/source/RegularListener.js";
import {
    defaultPackData,
    defaultUnpackData,
    SUBSCRIBE_CHANNEL_ACTION,
    UNSUBSCRIBE_CHANNEL_ACTION,
    DEFAULT_CHANNEL,
    CLIENT_READY,
} from "socketiyo-shared";

export * from "./defaultLogging.js";
export * from "./defaultOptions.js";

const RECONNECTING = Symbol();
const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();

const createConnection = (options) => {
    const { url } = options;
    const { packData = defaultPackData, unpackData = defaultUnpackData } = options;
    const { reconnectDelay, randomReconnectDelay } = options;
    let { autoReconnect } = options;
    const formatSend = (data, channel) => {
        const toSend = { channel, data };
        return packData(toSend);
    };
    let connection;
    let delayedUntilOpen = [];
    const facade = new RegularListener();
    const reconnect = () => {
        facade.emit(RECONNECTING);
        connection = new WebSocket(url);
        connection.addEventListener(`message`, x => {
            const parsed = unpackData(x.data);
            facade.emit(parsed.channel, parsed.data);
        });
        connection.addEventListener(`close`, (x) => {
            facade.emit(DISCONNECT, x);
            if (autoReconnect) {
                const delay = reconnectDelay + Math.random() * randomReconnectDelay;
                setTimeout(reconnect, delay);
            }
        });
        connection.addEventListener(`error`, error => {
            facade.emit(ERROR, error);
            try {
                connection.close();
            } catch (connectionCloseError) {
                // eslint-disable-line
            }
        });
        connection.addEventListener(`open`, () => {
            facade.emit(CONNECT);
            facade.eventNamesStrings().forEach(eventName => {
                facade.emit(onFirstSubscribeString, eventName);
            });
            sendOrDrop(packData({action: CLIENT_READY, channel: ``})); 
        });
    };
    const safeSend = (x) => {
        if (connection.readyState === WebSocket.OPEN) {
            connection.send(x);
        } else {
            delayedUntilOpen.push(x);
        }
    };
    const sendOrDrop = (x) => {
        if (connection.readyState === WebSocket.OPEN) {
            connection.send(x);
        } /* else drop */
    };
    facade.send = (x, channel = DEFAULT_CHANNEL) => {
        safeSend(formatSend(x, channel));
    };
    facade.close = () => {
        autoReconnect = false;
        connection.close();
        facade.off();
        delayedUntilOpen = undefined;
    };
    facade.on(onFirstSubscribeString, eventName => {
        if (eventName === DEFAULT_CHANNEL) {
            return;
        }
        sendOrDrop(packData({
            channel: eventName,
            action: SUBSCRIBE_CHANNEL_ACTION,
        }));
    });
    facade.on(onLastUnsubscribeString, eventName => {
        if (eventName === DEFAULT_CHANNEL) {
            return;
        }
        sendOrDrop(packData({
            channel: eventName,
            action: UNSUBSCRIBE_CHANNEL_ACTION,
        }));
    });
    reconnect();
    return facade;
};


