export {
    CONNECT,
    DISCONNECT,
    ERROR,
    HIGH_LOAD,
    AVAILABLE,
    OVER_LOAD,
    RECEIVE_MESSAGE,
    RECEIVE_SUBSCRIBE,
    RECEIVE_UNSUBSCRIBE,
    PONG,
    MESSAGE_FORMAT_ERROR,
    VALIDATE_CHANNEL_ERROR,
    VALIDATE_MESSAGE_ERROR,
    MAX_CHANNELS_ERROR,
    LAST_CONNECTION_CHECK,
    IS_READY,
};
// todo now that eventNames are string, they can be once again with app event names
// Public properties
// todo symbol also does not equal itself if one file import { useAdditionalDisconnectionDetection } from "../extensions/disconnectionDetection.js"; and another socketiyo.es is imported differently
const LAST_CONNECTION_CHECK = Symbol();
// general
const CONNECT = "CONNECT";
const DISCONNECT = "DISCONNECT";
const ERROR = "ERROR";
const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";
const RECEIVE_SUBSCRIBE = "RECEIVE_SUBSCRIBE";
const RECEIVE_UNSUBSCRIBE = "RECEIVE_UNSUBSCRIBE";
const PONG = "PONG";

// required infrastructure for scaling
const HIGH_LOAD = "HIGH_LOAD";
const AVAILABLE = "AVAILABLE";
const OVER_LOAD = "OVER_LOAD";

// client errors
const VALIDATE_MESSAGE_ERROR = "VALIDATE_MESSAGE_ERROR";
const MESSAGE_FORMAT_ERROR = "MESSAGE_FORMAT_ERROR";
const VALIDATE_CHANNEL_ERROR = "VALIDATE_CHANNEL_ERROR";
const MAX_CHANNELS_ERROR = "MAX_CHANNELS_ERROR";
const IS_READY = "IS_READY";
