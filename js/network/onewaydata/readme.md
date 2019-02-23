# onewaydata

Server sent events for NodeJs

Server Sent Events (EventSource client side)
https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events

Status: Draft

See [examples](./examples)

## install

npm i onewaydata

## todo

send :keepaliveping every 15s ?
make sure to disable chunking
allow to send events (EVENT)

## usage

```js
import {
  createEventStream,
  sendOne,
  RECONNECT_EVENT,
  CONNECT_EVENT,
  DISCONNECT_EVENT
} from "onewaydata";

const server = ...

const eventStream = createEventStream(server, {path: `/sse`});

eventStream.on(CONNECT_EVENT, () => {
  console.log(`someone connected`);
});
eventStream.on(DISCONNECT_EVENT, () => {
  console.log(`someone disconnected`);
});
eventStream.on(RECONNECT_EVENT, () => {
  console.log(`someone reconnected`);
});

eventStream.send(`something`);
```


### License

[CC0](./license.txt)