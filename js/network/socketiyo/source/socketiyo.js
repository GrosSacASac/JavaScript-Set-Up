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

const isSocketInChannel = (socket, channel) => {
	return channel === DEFAULT_CHANNEL || socket.channels.has(channel);
};

const enhanceSocket = socket => {
	socket.channels = new Set();
};

const attachWebSocketServer = (options) => {
	const {httpServer, ws} = options;
	const {maxClients, maxLength, maxChannels, maxChannelLength} = options;

	const wss = new ws.Server({ server: httpServer });

	const websocketServerFacade = EventEmitter({});
	const connectionsPool = new Set();

	websocketServerFacade.send = (socket, data, channel=DEFAULT_CHANNEL) => {
		if (isSocketInChannel(socket, channel)) {
			socket.send(formatSend(data, channel));
		}
	};

	websocketServerFacade.sendAll = (data, channel=DEFAULT_CHANNEL) => {
		const toSend = formatSend(data, channel);
		connectionsPool.forEach(socket => {
			if (isSocketInChannel(socket, channel)) {
				socket.send(toSend);
			}
		});
	};

	websocketServerFacade.sendAllExceptOne = (exceptionSocket, data, channel=DEFAULT_CHANNEL) => {
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
			websocketServerFacade.emit(HIGH_LOAD, highClients);
		} else if (connectionsPool.size >= maxClients) {
			websocketServerFacade.emit(OVER_LOAD, maxClients);
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
			websocketServerFacade.emit(DISCONNECT, socket);
		});
		websocketServerFacade.emit(CONNECT, socket);
	};

	const listen = (socket, message) => {
		let error = validateLength(message, maxLength);
		if (error) {
			websocketServerFacade.emit(VALIDATE_MESSAGE_ERROR, error);
			return;
		}

		let parsed;
		try {
			parsed = unpackData(message);
		} catch (error) {
			websocketServerFacade.emit(MESSAGE_FORMAT_ERROR, {error, message});
			return;
		}

		error = validateFormat(parsed);
		if (error) {
			websocketServerFacade.emit(MESSAGE_FORMAT_ERROR, {error, parsed});
			return;
		}

		const { channel, data, action } = parsed;

		error = validateChannel(channel, maxChannelLength);
		if (error) {
			websocketServerFacade.emit(VALIDATE_CHANNEL_ERROR, error);
			return;
		}
		if (action === SUBSCRIBE_CHANNEL_ACTION) {
			if (socket.channels.size >= maxChannels) {
				websocketServerFacade.emit(MAX_CHANNELS_ERROR, maxChannels);
				return;
			}
			socket.channels.add(channel);
			return;
		}
		if (action === UNSUBSCRIBE_CHANNEL_ACTION) {
			socket.channels.delete(channel);
			return;
		}
		websocketServerFacade.emit(channel, {
			data,
			socket,
		});
	};
	wss.on(`connection`, connect);
	return websocketServerFacade;
};
