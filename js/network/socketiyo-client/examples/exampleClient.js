import {
    createConnection,
    CONNECT,
    DISCONNECT,
	ERROR,
    DEFAULT_CHANNEL
} from "../source/socketiyo-client.js";

const socketiyoConnection = createConnection({url: `ws://localhost:8080/`});

socketiyoConnection.on(DEFAULT_CHANNEL, (x) => {
    console.log(x);
});

socketiyoConnection.on(`game/end`, (x) => {
    console.log(`game/end ${x}`);
    document.body.textContent += x;
});