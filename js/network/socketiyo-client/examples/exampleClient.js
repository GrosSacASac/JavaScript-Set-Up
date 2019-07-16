import {
    createConnection,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL
} from "../source/socketiyo-client.js";
import { reconnectDelay, randomReconnectDelay, autoReconnect } from "../source/defaultOptions.js";
import { useDefaultLogging } from "../source/defaultLogging.js";


const socketiyoConnection = createConnection({
    url: `ws://localhost:8080/`,
    reconnectDelay,
    randomReconnectDelay,
    autoReconnect,
});

useDefaultLogging({ socketiyoConnection });

socketiyoConnection.on(DEFAULT_CHANNEL, (x) => {
    console.log(x);
    document.body.textContent += x;
});

socketiyoConnection.on(`game/end`, (x) => {
    console.log(`game/end ${x}`);
    document.body.textContent += x;
});