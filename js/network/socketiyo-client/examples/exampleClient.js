
import {
    reconnectDelay, randomReconnectDelay, autoReconnect,
    useDefaultLogging,
    createConnection,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL
} from "../built/socketiyo-client.es.js";


const socketiyoConnection = createConnection({
    url: `ws://localhost:8080/socketiyo`,
    reconnectDelay,
    randomReconnectDelay,
    autoReconnect,
});

useDefaultLogging({ socketiyoConnection });

socketiyoConnection.on(DEFAULT_CHANNEL, (x) => {
    console.log(x);
});

socketiyoConnection.on(`game/end`, (x) => {
    console.log(`game/end ${x}`);
});