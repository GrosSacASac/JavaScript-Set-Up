export {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
	ERROR,
	DEFAULT_CHANNEL
};
import {validateFormat, validateLength} from "./validate.js";
import {maxClients, maxLength} from "./defaultOptions.js";
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
}

const enhanceSocket = socket => {
	socket.channels = new Set();
};

const attachWebSocketServer = (httpServer, ws) => {
	const wss = new ws.Server({ server: httpServer });

	const websocketServerFacade = EventEmitter({});
	const connectionsPool = new Set();

	websocketServerFacade.send = (socket, data, channel=DEFAULT_CHANNEL) => {
		console.log(`Sending on channel: ${channel}\nData: ${data}`);
		if (isSocketInChannel(socket, channel)) {
			socket.send(formatSend(data, channel));
		}
		
	};

	websocketServerFacade.sendAll = (data, channel=DEFAULT_CHANNEL) => {
		console.log(`Sending to all on channel: ${channel}\nData: ${data}`);
		const toSend = formatSend(data, channel);
		connectionsPool.forEach(socket => {
			if (isSocketInChannel(socket, channel)) {
				socket.send(toSend);
			}
		});
	};

	websocketServerFacade.sendAllExceptOne = (exceptionSocket, data, channel=DEFAULT_CHANNEL) => {
		console.log(`Sending to all except one on channel: ${channel}\nData: ${data}`);
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
			console.warn(`limit reached, dropping websocket client`);
			socket.close();
			return;
		}
		enhanceSocket(socket);
		connectionsPool.add(socket);
		websocketServerFacade.emit(CONNECT, socket);
		socket.on(`message`, listen.bind(undefined, socket))
		socket.on(`close`, () => {
			socket.off(`message`, listenBound);
			connectionsPool.delete(socket);
			websocketServerFacade.emit(DISCONNECT, socket);
		});
	};

	const listen = (from, message) => {
		let error = validateLength(message);
		if (error) {
			console.error(error);
			return;
		}

		let parsed;
		try {
			parsed = unpackData(message);
		} catch (error) {
			console.error(`invalid JSON received from websocket ${error}`);
			console.debug(message);
			return;
		}

		error = validateFormat(parsed);
		if (error) {
			console.error(error);
			return;
		}

		const { channel, data, action } = parsed;
		if (action === SUBSCRIBE_CHANNEL_ACTION) {
			console.log(`subscribing to channel ${channel}`);
			socket.channels.add(channel);
			return;
		}
		if (action === UNSUBSCRIBE_CHANNEL_ACTION) {
			console.log(`unsubscribing to channel ${channel}`);
			socket.channels.delete(channel);
			return;
		}
		console.log(`receiving data: ${parsed}`);
		websocketServerFacade.emit(channel, {
			data,
			from,
		});
	};
	wss.on(`connection`, connect);
	return websocketServerFacade;
};
