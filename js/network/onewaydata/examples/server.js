
import http from "node:http";
import fs from "node:fs";
import url from "node:url";
import path from "node:path";
import {
    createEventStream,
    sendOne,
    defaultChannel,
} from "../source/onewaydata.js";
import {
    useDefaultLogging
} from "../source/defaultLogging.js";


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;


const server = http.createServer((req, res) => {
    if (req.url === `/`) {
        fs.createReadStream(`${__dirname}/client.html`).pipe(res);
    }
});

const path = `/sse`;
const condition = (request) => {
    request.url === path;
};
const eventStream = createEventStream({ server, condition });
useDefaultLogging({ eventStream });


server.listen(PORT);
console.log(`open http:localhost:${PORT}/`);

let i = 0;
setInterval(() => {
    eventStream.send({ data: ++i });
}, 3000);

setInterval(() => {
    eventStream.send({
        event: `football/goal`,
        data: `team 1`,
        id: String(Date.now()),
    });
}, 5000);
