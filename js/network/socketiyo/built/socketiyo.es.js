const isObject = x => {
	return typeof x === `object` && x !== null;
};

const DEFAULT_CHANNEL = ``;
const SUBSCRIBE_CHANNEL_ACTION = `SUBSCRIBE_CHANNEL_ACTION`;
const UNSUBSCRIBE_CHANNEL_ACTION = `UNSUBSCRIBE_CHANNEL_ACTION`;
const CLIENT_READY = `CLIENT_READY`;

const defaultPackData = (data) => {
    return JSON.stringify(data);
};

const defaultUnpackData = (data) => {
    if (data.fill) {
        // buffer
        data = String(data);
    }
    return JSON.parse(data);
};

const textEncoder = new TextEncoder();
const bytesLengthFromString = string => {
    return textEncoder.encode(string).length;
};

const validateFormat = parsedMessage => {
    if (!isObject(parsedMessage)) {
        return `message should be an object`;
    }
    if (!Object.prototype.hasOwnProperty.call(parsedMessage, `channel`)) {
        return `message should have a channel`;
    }
    if (!Object.prototype.hasOwnProperty.call(parsedMessage, `data`) &&
        !Object.prototype.hasOwnProperty.call(parsedMessage, `action`)) {
        return `message should have data or action`;
    }
};

const validateLength = (message, maxLength) => {
    if (bytesLengthFromString(message) >= maxLength) {
        return `message length ${message.length} is above limit ${maxLength}`;
    }
};

const validateChannel = (channel, maxChannelLength) => {
    if (bytesLengthFromString(channel) >= maxChannelLength) {
        return `channel length is above limit ${maxChannelLength}`;
    }
    if (channel === DEFAULT_CHANNEL) {
        return `subscribing to the DEFAULT_CHANNEL is not useful`;
    }
};

/**
 * Use it as a constructor
 * or as a decorator for an existing object
 * or as a base class for extend
 * cannot be used as a mixin for a constructor's prototype
 * without calling the constructor
 */
function EventEmitter3(obj) {
    (obj || this)._callbacks = Object.create(null);
    if (obj) {return Object.assign(obj, EventEmitter3.prototype);}
}

/**
 * Listen on the given `eventName` with `fn`
 *
 * @param {String | Symbol} eventName
 * @param {Function} fn
 * @api public
 */

EventEmitter3.prototype.on = function (eventName, fn) {
    (this._callbacks[eventName] = this._callbacks[eventName] || [])
        .push(fn);
};

/**
 * Adds an `eventName` listener that will be invoked once then removed
 *
 * @param {String | Symbol} eventName
 * @param {Function} fn
 * @api public
 */

EventEmitter3.prototype.once = function (eventName, fn) {
    const once = (data) => {
        this.off(eventName, once);
        fn(data);
    };

    once.fn = fn; // makes it possible to remove with off
    this.on(eventName, once);
};

/**
 * Remove a callback for `eventName` or
 * all callbacks for `eventName` or
 * all callbacks for all events
 *
 * @param {String | Symbol} eventName
 * @param {Function} fn
 * @api public
 */

EventEmitter3.prototype.off = function (eventName, fn) {
    // all
    if (!eventName) {
        this._callbacks = Object.create(null);
        return;
    }

    // specific event
    const callbacks = this._callbacks[eventName];
    if (!callbacks) {
        return;
    }

    // remove all handlers
    if (!fn) {
        delete this._callbacks[eventName];
        return;
    }

    // remove specific handler
    const index = callbacks.findIndex(function (cb) {
        return (cb === fn || cb.fn === fn);
    });
    if (index > -1) {
        // Remove event specific arrays for the eventName type that no
        // one is subscribed for, to avoid memory leak.
        if (callbacks.length === 1) {
            delete this._callbacks[eventName];
        } else {
            callbacks.splice(index, 1);
        }
    }
};

/**
 * Emit `eventName` with data
 *
 * @param {String | Symbol} eventName
 * @param {any} data
 */

EventEmitter3.prototype.emit = function (eventName, data) {
    const callbacks = this._callbacks[eventName];
    if (!callbacks) {
        return;
    }
    const frozenCallbacks = Array.from(callbacks);
    frozenCallbacks.forEach(callback => {
        callback(data);
    });
};

/**
 * Return array of callbacks for `eventName`
 *
 * @param {String | Symbol} eventName
 * @return {Array} listeners
 * @api public
 */

EventEmitter3.prototype.listeners = function (eventName) {
    return this._callbacks[eventName] || [];
};

/**
 * True if this emitter has `eventName` handlers
 *
 * @param {String | Symbol} eventName
 * @return {Boolean}
 * @api public
 */

EventEmitter3.prototype.hasListeners = function (eventName) {
    return Boolean(this.listeners(eventName).length);
};

/**
 * Returns an array of event names for which the emitter has registered listeners
 *
 * @return {Array <String || Symbol>}
 * @api public
 */
EventEmitter3.prototype.eventNames = function () {
    return Reflect.ownKeys(this._callbacks);
};

/**
 * Returns an array of event anmes of type string
 * for which the emitter has registered listeners
 *
 * @return {Array <String>}
 * @api public
 */
EventEmitter3.prototype.eventNamesStrings = function () {
    return Object.keys(this._callbacks);
};

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
const IS_READY = Symbol();

// Public properties
const LAST_CONNECTION_CHECK = Symbol();

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

    

    const facade = EventEmitter3({});
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

export { AVAILABLE, CONNECT, DEFAULT_CHANNEL, DISCONNECT, ERROR, HIGH_LOAD, LAST_CONNECTION_CHECK, MAX_CHANNELS_ERROR, MESSAGE_FORMAT_ERROR, OVER_LOAD, PONG, RECEIVE_MESSAGE, RECEIVE_SUBSCRIBE, RECEIVE_UNSUBSCRIBE, VALIDATE_CHANNEL_ERROR, VALIDATE_MESSAGE_ERROR, attachWebSocketServer };
