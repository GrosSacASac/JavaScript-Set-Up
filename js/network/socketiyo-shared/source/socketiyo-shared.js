export {
    defaultPackData,
    defaultUnpackData,
    SUBSCRIBE_CHANNEL_ACTION,
    UNSUBSCRIBE_CHANNEL_ACTION,
    DEFAULT_CHANNEL
};

const DEFAULT_CHANNEL = ``;
const SUBSCRIBE_CHANNEL_ACTION = `SUBSCRIBE_CHANNEL_ACTION`;
const UNSUBSCRIBE_CHANNEL_ACTION = `UNSUBSCRIBE_CHANNEL_ACTION`;

const defaultPackData = (data) => {
    return JSON.stringify(data);
};

const defaultUnpackData = (data) => {
    return JSON.parse(data);
};
