export {
    createConnection,
    CONNECT,
    DISCONNECT,
	ERROR,
	DEFAULT_CHANNEL
};
import {
	RegularListener,
    onFirstSubscribeString,
    onLastUnsubscribeString,
} from "../node_modules/event-e3/source/RegularListener.js";
import {
	isString
} from "../node_modules/event-e3/source/isString.js";

import {
	packData,
	unpackData,
	formatSend,
	SUBSCRIBE_CHANNEL_ACTION,
	UNSUBSCRIBE_CHANNEL_ACTION,
	DEFAULT_CHANNEL
} from "../node_modules/socketiyo-shared/source/socketiyo-shared.js";

const reconnectionDelay = 3000;
const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();

const createConnection = (options) => {
	const {url} = options;
	let {autoReconnect = true} = options;
	let connection;
	let delayedUntilOpen = [];
	const facade = new RegularListener();
	const reconnect = () => {
		console.log(`reconnecting`)
		connection = new WebSocket(url);
		connection.addEventListener(`message`, (x) => {
			console.log(41, x);
			const parsed = unpackData(x.data);
			facade.emit(parsed.channel, parsed.data);
		});
		connection.addEventListener(`close`, (x) => {
			facade.emit(DISCONNECT, x);
			if (autoReconnect) {
				setTimeout(reconnect, reconnectionDelay);
			}
		});
		connection.addEventListener(`error`, (x) => {
			facade.emit(DISCONNECT, x);
			facade.emit(ERROR, x);
		});
		connection.addEventListener(`open`, () => {
			facade.emit(CONNECT, undefined);
			facade.eventNamesStrings().forEach(eventName => {
				console.log(`subscribing to channel ${eventName}`);
				connection.send(packData({
					channel: eventName,
					action: SUBSCRIBE_CHANNEL_ACTION
				}));
			});
		});
	};
	const safeSend = (x) => {
		if (connection.readyState === WebSocket.OPEN) {
			connection.send(x);
		} else {
			delayedUntilOpen.push(x)
		}
	};
	const sendOrDrop = (x) => {
		if (connection.readyState === WebSocket.OPEN) {
			connection.send(x);
		} /* else drop */
	};
	facade.send = (x, channel=DEFAULT_CHANNEL) => {
		safeSend(formatSend(x, channel));
	};
	facade.close = () => {
		autoReconnect = false;
		connection.close();
		facade.off();
		delayedUntilOpen = undefined;
	};
	facade.on(onFirstSubscribeString, eventName => {
		if (eventName === DEFAULT_CHANNEL) {
			return;
		}
		console.log(`subscribing to channel ${eventName}`);
		sendOrDrop(packData({
			channel: eventName,
			action: SUBSCRIBE_CHANNEL_ACTION
		}));
	});
	facade.on(onLastUnsubscribeString, eventName => {
		if (eventName === DEFAULT_CHANNEL) {
			return;
		}
		console.log(`unsubscribing to channel ${eventName}`);
		sendOrDrop(packData({
			channel: eventName,
			action: SUBSCRIBE_CHANNEL_ACTION
		}));
	});
	reconnect();
    return facade;
};


