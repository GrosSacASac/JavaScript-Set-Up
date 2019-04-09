export { validateFormat, validateLength, validateChannel };
import {isObject} from "./isObject.js";
import {DEFAULT_CHANNEL} from "socketiyo-shared";


const validateFormat = parsedMessage => {
	if (!isObject(parsedMessage)) {
		return 'message should be an object';
	}
	if (!Object.prototype.hasOwnProperty.call(parsedMessage, `channel`)) {
		return 'message should have a channel';
	}
	if (!Object.prototype.hasOwnProperty.call(parsedMessage, `data`)) {
		return 'message should have data';
	}
};

const validateLength = (message, maxLength) => {
	if (message.length >= maxLength) {
		return `message length ${message.length} is above limit ${maxLength}`;
	}
};

const validateChannel = (channel, maxChannelLength) => {
	if (String(channel).length >= maxChannelLength) {
		return `channel length is above limit ${maxChannelLength}`;
	}
	if (channel === DEFAULT_CHANNEL) {
		return `subscribing to the DEFAULT_CHANNEL is not usefull`;
	}
};
