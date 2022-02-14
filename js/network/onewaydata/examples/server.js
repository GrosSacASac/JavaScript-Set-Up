
import http from "node:http";
import fs from "node:fs";
import url from "node:url";
import path from "node:path";
import {
    createEventStream,
    RECONNECT,
    sendOne,
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
    } else {
        console.log(req.headers);
    }
});


const condition = (request) => {
    return request.url === `/sse`;
};
const eventStream = createEventStream({ server, condition });
useDefaultLogging({ eventStream });

eventStream.on(RECONNECT, ({lastId, response}) => {
    if (lastId) {
        // opportunity to resume with sendOne
        let dateString = ``;
        let numberId = Number(lastId);
        if (Number.isFinite(numberId)) {
            const d = new Date();
            d.setTime(numberId);
            dateString = d.toTimeString();
        }
        sendOne(response, {
            event: `football/goal`,
            data: `Welcome back, you missed some goals since ${dateString}`,
        });
    }
});

server.listen(PORT);
console.log(`open http:localhost:${PORT}/`);

let i = 0;
setInterval(() => {
    eventStream.send({ data: ++i });
}, 1000);

setInterval(() => {
    eventStream.send({
        event: `football/goal`,
        data: `team 1`,
        id: String(Date.now()),
    });
}, 5000);
