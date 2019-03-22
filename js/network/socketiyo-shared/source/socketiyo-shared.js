export {
	formatSend,
	SUBSCRIBE_CHANNEL_ACTION,
	UNSUBSCRIBE_CHANNEL_ACTION,
	DEFAULT_CHANNEL
};

const DEFAULT_CHANNEL = ``;
const SUBSCRIBE_CHANNEL_ACTION = `SUBSCRIBE_CHANNEL_ACTION`;
const UNSUBSCRIBE_CHANNEL_ACTION = `UNSUBSCRIBE_CHANNEL_ACTION`;

const formatSend = (data, channel) => {
	const toSend = { channel, data };
	return JSON.stringify(toSend);
};



