export {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
    ERROR,
    HIGH_LOAD,
    AVAILABLE,
    OVER_LOAD,
    RECEIVE_MESSAGE,
    RECEIVE_SUBSCRIBE,
    RECEIVE_UNSUBSCRIBE,
    PONG,
    MESSAGE_FORMAT_ERROR,
    VALIDATE_CHANNEL_ERROR,
    VALIDATE_MESSAGE_ERROR,
    MAX_CHANNELS_ERROR,
    DEFAULT_CHANNEL,
    LAST_CONNECTION_CHECK,
};
import { validateFormat, validateLength, validateChannel } from "./validate.js";
import EventEmitter from "event-e3/EventEmitter3.mjs";
import {
    packData,
    unpackData,
    formatSend,
    SUBSCRIBE_CHANNEL_ACTION,
    UNSUBSCRIBE_CHANNEL_ACTION,
    DEFAULT_CHANNEL,
} from "socketiyo-shared";

// general
const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();
const RECEIVE_MESSAGE = Symbol();
const RECEIVE_SUBSCRIBE = Symbol();
const RECEIVE_UNSUBSCRIBE = Symbol();
const PONG = Symbol();

// required infrastructure for scaling
const HIGH_LOAD = Symbol();
const AVAILABLE = Symbol();
const OVER_LOAD = Symbol();

// client errors
const VALIDATE_MESSAGE_ERROR = Symbol();
const MESSAGE_FORMAT_ERROR = Symbol();
const VALIDATE_CHANNEL_ERROR = Symbol();
const MAX_CHANNELS_ERROR = Symbol();

// Public properties
const LAST_CONNECTION_CHECK = Symbol();

// Private properties
const CHANNELS = Symbol();

const isSocketInChannel = (socket, channel) => {
    return channel === DEFAULT_CHANNEL || socket[CHANNELS].has(channel);
};

const enhanceSocket = socket => {
    socket[CHANNELS] = new Set();
    socket[LAST_CONNECTION_CHECK] = Date.now();
};

const send = (socket, data, channel = DEFAULT_CHANNEL) => {
    if (isSocketInChannel(socket, channel)) {
        socket.send(formatSend(data, channel));
        socket[LAST_CONNECTION_CHECK] = Date.now();
    }
};

const attachWebSocketServer = (options) => {
    const { httpServer, ws } = options;
    const {
        highClients,
        maxClients,
        maxLength,
        maxChannels,
        maxChannelLength,
        lowEnough,
    } = options;

    const wss = new ws.Server({ server: httpServer });

    const facade = EventEmitter({});
    const connectionsPool = new Set();

    facade.connectionsPool = connectionsPool;
    facade.send = send

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
            socket.off();
            socket.close();
        });
        connectionsPool.clear();
        wss.close();
    };

    const connect = socket => {
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
        facade.emit(CONNECT, socket);
    };

    const listen = (socket, message) => {
        let error = validateLength(message, maxLength);
        if (error) {
            facade.emit(VALIDATE_MESSAGE_ERROR, error);
            return;
        }

        let parsed;
        try {
            parsed = unpackData(message);
        } catch (error) {
            facade.emit(MESSAGE_FORMAT_ERROR, { error, message });
            return;
        }

        error = validateFormat(parsed);
        if (error) {
            facade.emit(MESSAGE_FORMAT_ERROR, { error, parsed });
            return;
        }

        const { channel, data, action } = parsed;

        error = validateChannel(channel, maxChannelLength);
        if (error) {
            facade.emit(VALIDATE_CHANNEL_ERROR, error);
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
    wss.on(`connection`, connect);
    return facade;
};
