# onewaydata

Server sent events for NodeJs

Server Sent Events (EventSource client side)
https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events

Status: Draft

See [examples](./examples)

## install

npm i onewaydata

## todo

send :keepaliveping every 15s as option
allow to send events (EVENT)

## usage

```js
import {
  createEventStream,
  sendOne,
} from "onewaydata";
import {
  useDefaultLogging
} from "onewaydata/source/defaultLogging.js";


const server = ...

const eventStream = createEventStream(server, {path: `/sse`});
useDefaultLogging({ eventStream });


eventStream.send(`something`);
```


### License

[CC0](./license.txt)