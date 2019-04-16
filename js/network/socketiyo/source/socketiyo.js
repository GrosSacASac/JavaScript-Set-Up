export {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
	ERROR,
	HIGH_LOAD,
	AVAILABLE,
	OVER_LOAD,
	MESSAGE_FORMAT_ERROR,
	VALIDATE_CHANNEL_ERROR,
	VALIDATE_MESSAGE_ERROR,
	MAX_CHANNELS_ERROR,
	DEFAULT_CHANNEL,
};
import {validateFormat, validateLength, validateChannel} from "./validate.js";
import EventEmitter from "event-e3";
import {
	packData,
	unpackData,
	formatSend,
	SUBSCRIBE_CHANNEL_ACTION,
	UNSUBSCRIBE_CHANNEL_ACTION,
	DEFAULT_CHANNEL
} from "socketiyo-shared";

// general
const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();

// required infrastructure for scaling
const HIGH_LOAD = Symbol();
const AVAILABLE = Symbol();
const OVER_LOAD = Symbol();

// client errors
const VALIDATE_MESSAGE_ERROR = Symbol();
const MESSAGE_FORMAT_ERROR = Symbol();
const VALIDATE_CHANNEL_ERROR = Symbol();
const MAX_CHANNELS_ERROR = Symbol();

// Private properties
const CHANNELS = Symbol();

const isSocketInChannel = (socket, channel) => {
	return channel === DEFAULT_CHANNEL || socket[CHANNELS].has(channel);
};

const enhanceSocket = socket => {
	socket.channels = new Set();
};

const send = (socket, data, channel=DEFAULT_CHANNEL) => {
	if (isSocketInChannel(socket, channel)) {
		socket.send(formatSend(data, channel));
	}
};

const attachWebSocketServer = (options) => {
	const {httpServer, ws} = options;
	const {maxClients, maxLength, maxChannels, maxChannelLength} = options;

	const wss = new ws.Server({ server: httpServer });

	const facade = EventEmitter({});
	const connectionsPool = new Set();

	facade.send = send

	facade.sendAll = (data, channel=DEFAULT_CHANNEL) => {
		const toSend = formatSend(data, channel);
		connectionsPool.forEach(socket => {
			if (isSocketInChannel(socket, channel)) {
				socket.send(toSend);
			}
		});
	};

	facade.sendAllExceptOne = (exceptionSocket, data, channel=DEFAULT_CHANNEL) => {
		const toSend = formatSend(data, channel);
		connectionsPool.forEach(socket => {
			if (socket !== exceptionSocket) {
				if (isSocketInChannel(socket, channel)) {
					socket.send(toSend);
				}
			}
		});
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
		socket.on(`close`, () => {
			socket.off(`message`, listenBound);
			connectionsPool.delete(socket);
			facade.emit(DISCONNECT, socket);
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
			facade.emit(MESSAGE_FORMAT_ERROR, {error, message});
			return;
		}

		error = validateFormat(parsed);
		if (error) {
			facade.emit(MESSAGE_FORMAT_ERROR, {error, parsed});
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
			return;
		}
		if (action === UNSUBSCRIBE_CHANNEL_ACTION) {
			socket[CHANNELS].delete(channel);
			return;
		}
		facade.emit(channel, {
			data,
			socket,
		});
	};
	wss.on(`connection`, connect);
	return facade;
};
