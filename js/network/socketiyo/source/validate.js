export { validateFormat, validateLength, validateChannel };
import { isObject } from "./isObject.js";
import { DEFAULT_CHANNEL } from "socketiyo-shared";
import { bytesLengthFromString } from "utilsac";


const validateFormat = parsedMessage => {
    if (!isObject(parsedMessage)) {
        return `message should be an object`;
    }
    if (!Object.prototype.hasOwnProperty.call(parsedMessage, `channel`)) {
        return `message should have a channel`;
    }
    if (!Object.prototype.hasOwnProperty.call(parsedMessage, `data`) &&
        !Object.prototype.hasOwnProperty.call(parsedMessage, `action`)) {
        return `message should have data or action`;
    }
};

const validateLength = (message, maxLength) => {
    if (bytesLengthFromString(message) >= maxLength) {
        return `message length ${message.length} is above limit ${maxLength}`;
    }
};

const validateChannel = (channel, maxChannelLength) => {
    if (bytesLengthFromString(channel) >= maxChannelLength) {
        return `channel length is above limit ${maxChannelLength}`;
    }
    if (channel === DEFAULT_CHANNEL) {
        return `subscribing to the DEFAULT_CHANNEL is not useful`;
    }
};
