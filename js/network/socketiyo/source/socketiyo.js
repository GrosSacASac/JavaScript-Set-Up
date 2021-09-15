export {
    attachWebSocketServer,
    DEFAULT_CHANNEL,
    LAST_CONNECTION_CHECK,
};
import { validateFormat, validateLength, validateChannel } from "./validate.js";
import EventEmitter from "event-e3/event-e3.js";
import {
    defaultPackData,
    defaultUnpackData,
    SUBSCRIBE_CHANNEL_ACTION,
    UNSUBSCRIBE_CHANNEL_ACTION,
    DEFAULT_CHANNEL,
    CLIENT_READY,
} from "socketiyo-shared";
import {
    CONNECT,
    DISCONNECT,
    HIGH_LOAD,
    AVAILABLE,
    OVER_LOAD,
    RECEIVE_MESSAGE,
    RECEIVE_SUBSCRIBE,
    RECEIVE_UNSUBSCRIBE,
    PONG,
    ERROR,
    MESSAGE_FORMAT_ERROR,
    VALIDATE_CHANNEL_ERROR,
    VALIDATE_MESSAGE_ERROR,
    MAX_CHANNELS_ERROR,
    LAST_CONNECTION_CHECK,
    IS_READY,
} from "./eventNames.js";
export {
    CONNECT,
    DISCONNECT,
    HIGH_LOAD,
    AVAILABLE,
    OVER_LOAD,
    RECEIVE_MESSAGE,
    RECEIVE_SUBSCRIBE,
    RECEIVE_UNSUBSCRIBE,
    PONG,
    ERROR,
    MESSAGE_FORMAT_ERROR,
    VALIDATE_CHANNEL_ERROR,
    VALIDATE_MESSAGE_ERROR,
    MAX_CHANNELS_ERROR,
}





// Private properties
const CHANNELS = Symbol();

const isSocketInChannel = (socket, channel) => {
    return channel === DEFAULT_CHANNEL || socket[CHANNELS].has(channel);
};

const enhanceSocket = socket => {
    socket[IS_READY] = false;
    socket[CHANNELS] = new Set();
    socket[LAST_CONNECTION_CHECK] = Date.now();
};

const attachWebSocketServer = (options) => {
    const {
        webSocketServer,
        highClients,
        maxClients,
        maxLength,
        maxChannels,
        maxChannelLength,
        lowEnough,
        packData = defaultPackData,
        unpackData = defaultUnpackData,
    } = options;

    

    const facade = EventEmitter({});
    const connectionsPool = new Set();

    facade.connectionsPool = connectionsPool;

    const formatSend = (data, channel) => {
        const toSend = { channel, data };
        return packData(toSend);
    };
    facade.send = (socket, data, channel = DEFAULT_CHANNEL) => {
        if (isSocketInChannel(socket, channel)) {
            socket.send(formatSend(data, channel));
            socket[LAST_CONNECTION_CHECK] = Date.now();
        }
    };


    facade.sendAll = (data, channel = DEFAULT_CHANNEL) => {
        const now = Date.now();
        const toSend = formatSend(data, channel);
        connectionsPool.forEach(socket => {
            if (isSocketInChannel(socket, channel)) {
                socket.send(toSend);
                socket[LAST_CONNECTION_CHECK] = now;
            }
        });
    };

    facade.sendAllExceptOne = (exceptionSocket, data, channel = DEFAULT_CHANNEL) => {
        const now = Date.now();
        const toSend = formatSend(data, channel);
        connectionsPool.forEach(socket => {
            if (socket !== exceptionSocket) {
                if (isSocketInChannel(socket, channel)) {
                    socket.send(toSend);
                    socket[LAST_CONNECTION_CHECK] = now;
                }
            }
        });
    };

    facade.close = () => {
        /* remove all event listeners, close all the connections */
        facade.off();
        connectionsPool.forEach(socket => {
            socket.removeAllListeners();
            socket.close();
        });
        connectionsPool.clear();
        webSocketServer.close();
        for (const ws of webSocketServer.clients) {
            ws.terminate();
        }
    };

    const connect = socket => {
        socket = socket.detail || socket;
        if (connectionsPool.size === highClients) {
            facade.emit(HIGH_LOAD, highClients);
        } else if (connectionsPool.size >= maxClients) {
            facade.emit(OVER_LOAD, maxClients);
            socket.close();
            return;
        }
        enhanceSocket(socket);
        connectionsPool.add(socket);
        const listenBound = listen.bind(undefined, socket);
        socket.on(`message`, listenBound);
        socket.on(`pong`, () => {
            facade.emit(PONG, { socket });
        });
        socket.on(`close`, () => {
            socket.off(`message`, listenBound);
            connectionsPool.delete(socket);
            facade.emit(DISCONNECT, socket);
            if (connectionsPool.size === lowEnough) {
                facade.emit(AVAILABLE, lowEnough);
            }
        });
        // facade.emit(CONNECT, socket);
    };

    const listen = (socket, messageBuffer) => {
        const validationError = validateLength(messageBuffer, maxLength);
        if (validationError) {
            facade.emit(VALIDATE_MESSAGE_ERROR, validationError);
            return;
        }

        let parsed;
        try {
            parsed = unpackData(messageBuffer);
        } catch (parseError) {
            facade.emit(MESSAGE_FORMAT_ERROR, { error: parseError, message: messageBuffer});
            return;
        }

        const formatError = validateFormat(parsed);
        if (formatError) {
            facade.emit(MESSAGE_FORMAT_ERROR, { error: formatError, parsed });
            return;
        }

        const { channel, data, action } = parsed;
        
        if (action === CLIENT_READY) {
            if (!socket[IS_READY]) {
                facade.emit(CONNECT, socket);
                socket[IS_READY] = true;
            }
            return;
        }
        const validChannelError = validateChannel(channel, maxChannelLength);
        if (validChannelError) {
            facade.emit(VALIDATE_CHANNEL_ERROR, validChannelError);
            return;
        }
        if (action === SUBSCRIBE_CHANNEL_ACTION) {
            if (socket[CHANNELS].size >= maxChannels) {
                facade.emit(MAX_CHANNELS_ERROR, maxChannels);
                return;
            }
            socket[CHANNELS].add(channel);
            facade.emit(RECEIVE_SUBSCRIBE, {
                channel,
                socket,
            });
            return;
        }
        if (action === UNSUBSCRIBE_CHANNEL_ACTION) {
            socket[CHANNELS].delete(channel);
            facade.emit(RECEIVE_UNSUBSCRIBE, {
                channel,
                socket,
            });
            return;
        }
        facade.emit(RECEIVE_MESSAGE, {
            channel,
            data,
            socket,
        });
        facade.emit(channel, {
            data,
            socket,
        });
    };
    webSocketServer.on(`connection`, connect);
    return facade;
};
