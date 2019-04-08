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
	packData,
	unpackData,
	formatSend,
	SUBSCRIBE_CHANNEL_ACTION,
	UNSUBSCRIBE_CHANNEL_ACTION,
	DEFAULT_CHANNEL
} from "../node_modules/socketiyo-shared/source/socketiyo-shared.js";


const CONNECT = Symbol();
const DISCONNECT = Symbol();
const ERROR = Symbol();

const createConnection = (options) => {
	const {url, logger = console} = options;
	const {reconnectionDelay} = options;
	let {autoReconnect} = options;
	let connection;
	let delayedUntilOpen = [];
	const facade = new RegularListener();
	const reconnect = () => {
		logger.log(`reconnecting`)
		connection = new WebSocket(url);
		connection.addEventListener(`message`, x => {
			logger.debug(`received message`);
			logger.debug(x);
			const parsed = unpackData(x.data);
			facade.emit(parsed.channel, parsed.data);
		});
		connection.addEventListener(`close`, (x) => {
			logger.debug(`connection closed`);
			facade.emit(DISCONNECT, x);
			if (autoReconnect) {
				setTimeout(reconnect, reconnectionDelay);
			}
		});
		connection.addEventListener(`error`, error => {
			logger.error(error);
			facade.emit(ERROR, error);
			try {
				connection.close();
			} catch (connectionCloseError) {

			}
		});
		connection.addEventListener(`open`, () => {
			logger.log(`connection opened`);
			facade.emit(CONNECT, undefined);
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
		logger.log(`subscribing to channel ${eventName}`);
		sendOrDrop(packData({
			channel: eventName,
			action: SUBSCRIBE_CHANNEL_ACTION
		}));
	});
	facade.on(onLastUnsubscribeString, eventName => {
		if (eventName === DEFAULT_CHANNEL) {
			return;
		}
		logger.log(`unsubscribing to channel ${eventName}`);
		sendOrDrop(packData({
			channel: eventName,
			action: UNSUBSCRIBE_CHANNEL_ACTION
		}));
	});
	reconnect();
    return facade;
};


