
import http from "http";
import fs from "fs";
import {
  reateEventStream,
  sendOne,
  RECONNECT_EVENT,
  CONNECT_EVENT,
  DISCONNECT_EVENT
} from "../sse.js";

const PORT = 8080;
const server = http.createServer((req, res) => {
  if (req.url === `/`) {
    fs.createReadStream(`./client.html`).pipe(res);
  }
});

const eventStream = createEventStream(server, {path: `/sse`});

eventStream.on(CONNECT_EVENT, () => {
  console.log(`someone connected`)
});
eventStream.on(DISCONNECT_EVENT, () => {
  console.log(`someone disconnected`)
});
eventStream.on(RECONNECT_EVENT, () => {
  console.log(`someone reconnected`)
});

server.listen(PORT);
console.log(`listening on port ${PORT}, open`);
console.log(`http:localhost:${PORT}/`);

let i = 0;
setInterval(() => {
    eventStream.send(++i);
}, 3000);