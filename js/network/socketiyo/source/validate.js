export { validateFormat, validateLength };
import {isObject} from "./isObject.js";

const validateFormat = parsedMessage => {
	if (!isObject(parsedMessage)) {
		return 'message should be an object';
	}
	if (!parsedMessage.channel) {
		return 'message should have a channel';
	}
}

const validateLength = (message, maxLength) => {
	if (message.length >= maxLength) {
		return `message length ${message.length} is above limit ${maxLength}`;
	}
};
