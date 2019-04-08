export {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
	ERROR,
	DEFAULT_CHANNEL
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


const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();

const isSocketInChannel = (socket, channel) => {
	return channel === DEFAULT_CHANNEL || socket.channels.has(channel);
};

const enhanceSocket = socket => {
	socket.channels = new Set();
};

const attachWebSocketServer = (options) => {
	const {httpServer, ws, logger=console} = options;
	const {maxClients, maxLength, maxChannels, maxChannelLength} = options;

	const wss = new ws.Server({ server: httpServer });

	const websocketServerFacade = EventEmitter({});
	const connectionsPool = new Set();

	websocketServerFacade.send = (socket, data, channel=DEFAULT_CHANNEL) => {
		logger.log(`Sending on channel: ${channel}\nData: ${data}`);
		if (isSocketInChannel(socket, channel)) {
			socket.send(formatSend(data, channel));
		}
		
	};

	websocketServerFacade.sendAll = (data, channel=DEFAULT_CHANNEL) => {
		logger.log(`Sending to all on channel: ${channel}\nData: ${data}`);
		const toSend = formatSend(data, channel);
		connectionsPool.forEach(socket => {
			if (isSocketInChannel(socket, channel)) {
				socket.send(toSend);
			}
		});
	};

	websocketServerFacade.sendAllExceptOne = (exceptionSocket, data, channel=DEFAULT_CHANNEL) => {
		logger.log(`Sending to all except one on channel: ${channel}\nData: ${data}`);
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
		if (connectionsPool.size >= maxClients) {
			logger.warn(`${maxClients} connection limit reached, dropping websocket client`);
			socket.close();
			return;
		}
		enhanceSocket(socket);
		connectionsPool.add(socket);
		websocketServerFacade.emit(CONNECT, socket);
		const listenBound = listen.bind(undefined, socket);
		socket.on(`message`, listenBound);
		socket.on(`close`, () => {
			socket.off(`message`, listenBound);
			connectionsPool.delete(socket);
			websocketServerFacade.emit(DISCONNECT, socket);
		});
	};

	const listen = (socket, message) => {
		let error = validateLength(message, maxLength);
		if (error) {
			logger.error(error);
			return;
		}

		let parsed;
		try {
			parsed = unpackData(message);
		} catch (error) {
			logger.error(`invalid data received from websocket ${error}`);
			logger.debug(message);
			return;
		}

		error = validateFormat(parsed);
		if (error) {
			logger.error(error);
			return;
		}

		const { channel, data, action } = parsed;
		if (action === SUBSCRIBE_CHANNEL_ACTION) {
			error = validateChannel(channel, maxChannelLength);
			if (error) {
				logger.error(error);
				return;
			}
			if (socket.channels.size >= maxChannels) {
				logger.error(`Max channels subscription reached ${maxChannels}`);
				return;
			}
			logger.log(`subscribing to channel ${channel}`);
			socket.channels.add(channel);
			return;
		}
		if (action === UNSUBSCRIBE_CHANNEL_ACTION) {
			logger.log(`unsubscribing to channel ${channel}`);
			socket.channels.delete(channel);
			return;
		}
		logger.log(`receiving data: ${parsed}`);
		websocketServerFacade.emit(channel, {
			data,
			socket,
		});
	};
	wss.on(`connection`, connect);
	return websocketServerFacade;
};
