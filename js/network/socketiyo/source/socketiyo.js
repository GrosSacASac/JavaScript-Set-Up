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

wss.on(`connection`, function connection(ws) {
    ws.on("message", function incoming(message) {
        console.log(`received`, message);
        const parsed = JSON.parse(message);
    });

    ws.on(`close`, function (code, reason) {
        console.log(`closed, reason:`, reason || code.reason);
        handleLeave(ws);
    });

});


const attachWebSocketServer = (httpServer, ws) => {
	const wss = new ws.Server({ server: httpServer })

	const websocketServerFacade = EventEmitter({})
	const connectionsPool = new Map()

	websocketServerFacade.send = (channel, to, data) => {
		const socket = connectionsPool.get(to)
		if (!socket) {
			console.debug(
				`Did not send message ${data}, the connection to that socket does not exist anymore`
			)
			return
		}

		const toSend = { channel, data }
		const stringifiedData = JSON.stringify(toSend)

		socket.send(stringifiedData)

		console.log(`Sending on channel: ${channel}\nData: ${stringifiedData}`)
	}

	const connect = socket => {
		if (connectionsPool.size >= maxClients) {
			console.warn('limit reached, dropping websocket client')
			socket.close()
			return
		}
		const symbol = Symbol()
		connectionsPool.set(symbol, socket)
		const listenBound = listen.bind(undefined, symbol)
		socket.on('message', listenBound)
		socket.on('close', () => {
			socket.off('message', listenBound)
			connectionsPool.delete(symbol)
			websocketServerFacade.emit(DISCONNECT, symbol)
		})
	}

	const listen = (from, message) => {
		let error = validateLength(message)
		if (error) {
			console.error(error)
			return
		}

		let parsed
		try {
			parsed = JSON.parse(message)
		} catch (error) {
			console.error(`invalid JSON received from websocket ${error}`)
			console.debug(message)
			return
		}

		error = validateFormat(parsed)
		if (error) {
			console.error(error)
			return
		}

		console.log(`receiving data: ${message}`)
		const { channel, data } = parsed
		websocketServerFacade.emit(channel, {
			data,
			from,
		})
	}
	wss.on('connection', connect)
	return websocketServerFacade;
}

