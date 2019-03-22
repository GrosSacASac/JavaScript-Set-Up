export {
    createConnection,
    CONNECT,
    DISCONNECT,
	ERROR,
	DEFAULT_CHANNEL
};
import {EmitterListener, onSubscribe, onUnsubscribe} from "event-e3/source/EmitterListener";
import {
	formatSend,
	SUBSCRIBE_CHANNEL_ACTION,
	UNSUBSCRIBE_CHANNEL_ACTION,
	DEFAULT_CHANNEL
} from "socketiyo-shared";


const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();

const createConnection = (options) => {
    const {url} = options;
	const connection = new WebSocket(url);
	const facade = new EmitterListener();
    connection.addEventListener(`message`, (x) => {
		const parsed = JSON.parse(x.data);
        facade.emit(pased.channel, parsed.data);
	});
	facade.send = (x, channel=DEFAULT_CHANNEL) => {
		connection.send(formatSend(x, channel));
	};
	const outsideSubscriptionSet = new Set(); // add in event-e3
	facade.on(onSubscribe, ({eventName}) => {

	});
	facade.on(onUnsubscribe, 0)
    return facade;
};


// 	console.log(`subscribing to channel ${channel}`);
// 	console.log(`unsubscribing to channel ${channel}`);

