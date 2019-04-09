export {
	createConnection,
	RECONNECTING,
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
	packData,
	unpackData,
	formatSend,
	SUBSCRIBE_CHANNEL_ACTION,
	UNSUBSCRIBE_CHANNEL_ACTION,
	DEFAULT_CHANNEL
} from "../node_modules/socketiyo-shared/source/socketiyo-shared.js";

const RECONNECTING = Symbol();
const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();

const createConnection = (options) => {
	const {url} = options;
	const {reconnectionDelay} = options;
	let {autoReconnect} = options;
	let connection;
	let delayedUntilOpen = [];
	const facade = new RegularListener();
	const reconnect = () => {
		facade.emit(RECONNECTING);
		connection = new WebSocket(url);
		connection.addEventListener(`message`, x => {
			const parsed = unpackData(x.data);
			facade.emit(parsed.channel, parsed.data);
		});
		connection.addEventListener(`close`, (x) => {
			facade.emit(DISCONNECT, x);
			if (autoReconnect) {
				setTimeout(reconnect, reconnectionDelay);
			}
		});
		connection.addEventListener(`error`, error => {
			facade.emit(ERROR, error);
			try {
				connection.close();
			} catch (connectionCloseError) {

			}
		});
		connection.addEventListener(`open`, () => {
			facade.emit(CONNECT);
			facade.eventNamesStrings().forEach(eventName => {
				facade.emit(onFirstSubscribeString, eventName);
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
		sendOrDrop(packData({
			channel: eventName,
			action: SUBSCRIBE_CHANNEL_ACTION
		}));
	});
	facade.on(onLastUnsubscribeString, eventName => {
		if (eventName === DEFAULT_CHANNEL) {
			return;
		}
		sendOrDrop(packData({
			channel: eventName,
			action: UNSUBSCRIBE_CHANNEL_ACTION
		}));
	});
	reconnect();
    return facade;
};


