export {
	packData,
	unpackData,
	formatSend,
	SUBSCRIBE_CHANNEL_ACTION,
	UNSUBSCRIBE_CHANNEL_ACTION,
	DEFAULT_CHANNEL
};

const DEFAULT_CHANNEL = ``;
const SUBSCRIBE_CHANNEL_ACTION = `SUBSCRIBE_CHANNEL_ACTION`;
const UNSUBSCRIBE_CHANNEL_ACTION = `UNSUBSCRIBE_CHANNEL_ACTION`;

// encapsulate
const packData = (data) => {
	return JSON.stringify(data);
};

const unpackData = (data) => {
	return JSON.parse(data);
};

const formatSend = (data, channel) => {
	const toSend = { channel, data };
	return packData(toSend);
};




