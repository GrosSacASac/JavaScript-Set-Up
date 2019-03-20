export {
    createConnection,
    CONNECT,
    DISCONNECT,
	ERROR,
	DEFAULT_CHANNEL
};
import EventEmitter from "event-e3";

const createConnection = (options) => {
    const {url} = options;
	const connection = new WebSocket(url);
	const facade = EventEmitter({});
    connection.addEventListener(`message`, (x) => {
		const parsed = JSON.parse(x.data);
        facade.emit(DEFAULT_CHANNEL, parsed.data);
	});
	facade.send = 0;
	facade.subscribe = 0;
	facade.unsubscribe = 0;
	facade.send = 0;
    return facade;
};

const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();
const DEFAULT_CHANNEL = ``;
const SUBSCRIBE_CHANNEL_ACTION = `SUBSCRIBE_CHANNEL_ACTION`;
const UNSUBSCRIBE_CHANNEL_ACTION = `UNSUBSCRIBE_CHANNEL_ACTION`;

const formatSend = (data, channel) => {
	const toSend = { channel, data };
	return JSON.stringify(toSend);
};

		// const { channel, data, action } = parsed;
		// if (action === SUBSCRIBE_CHANNEL_ACTION) {
		// 	console.log(`subscribing to channel ${channel}`);
		// 	socket.channels.add(channel);
		// 	return;
		// }
		// if (action === UNSUBSCRIBE_CHANNEL_ACTION) {
		// 	console.log(`unsubscribing to channel ${channel}`);
		// 	socket.channels.delete(channel);
		// 	return;
		// }


