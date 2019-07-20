
import http from "http";
import fs from "fs";
import {
    createEventStream,
    sendOne,
} from "../source/onewaydata.js";
import {
    useDefaultLogging
} from "../source/defaultLogging.js";


const PORT = 8080;
const server = http.createServer((req, res) => {
    if (req.url === `/`) {
        fs.createReadStream(`./client.html`).pipe(res);
    }
});

const eventStream = createEventStream(server, { path: `/sse` });
useDefaultLogging({ eventStream });


server.listen(PORT);
console.log(`listening on port ${PORT}, open`);
console.log(`http:localhost:${PORT}/`);

let i = 0;
setInterval(() => {
    eventStream.send(++i);
}, 3000);
