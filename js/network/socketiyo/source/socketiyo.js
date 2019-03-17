export {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
    ERROR
};
import {validateFormat, validateLength} from "./validate.js";
import {maxClients, maxLength} from "./defaultOptions.js";
import EventEmitter from "event-e3";


const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();

const formatSend = (data, channel) => {
	const toSend = { channel, data };
	return JSON.stringify(toSend);
};


const attachWebSocketServer = (httpServer, ws) => {
	const wss = new ws.Server({ server: httpServer });

	const websocketServerFacade = EventEmitter({});
	const connectionsPool = new Set();

	websocketServerFacade.send = (socket, data, channel=``) => {
		console.log(`Sending on channel: ${channel}\nData: ${data}`);
		socket.send(formatSend(data, channel));
	};

	websocketServerFacade.sendAll = (data, channel=``) => {
		console.log(`Sending to all on channel: ${channel}\nData: ${data}`);
		const toSend = formatSend(data, channel);
		connectionsPool.forEach(socket => {
			socket.send(toSend);
		});
	};

	const connect = socket => {
		if (connectionsPool.size >= maxClients) {
			console.warn(`limit reached, dropping websocket client`);
			socket.close();
			return;
		}
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
			parsed = JSON.parse(message);
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

		console.log(`receiving data: ${message}`);
		const { channel, data } = parsed;
		websocketServerFacade.emit(channel, {
			data,
			from,
		});
	};
	wss.on(`connection`, connect);
	return websocketServerFacade;
}

