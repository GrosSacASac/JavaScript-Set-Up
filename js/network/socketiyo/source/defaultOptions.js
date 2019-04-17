export {
    maxClients,
    highClients,
    lowEnough,
    maxLength,
    maxChannels,
    maxChannelLength,
};

// required infrastructure for scaling
const maxClients = 10 ** 6;
const highClients = Math.round(maxClients * 0.8);
const lowEnough = Math.round(maxClients * 0.6);

// for client errors
const maxLength = 10 ** 9;
const maxChannels = 200;
const maxChannelLength = 100; 