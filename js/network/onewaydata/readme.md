# onewaydata

[Server sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events) for NodeJs

to be used with [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource) client side



## install

[npm i onewaydata](https://https://www.npmjs.com/package/onewaydata)

## usage

```js
import { createEventStream } from "onewaydata";
import { useDefaultLogging } from "onewaydata/source/defaultLogging.js";


const server = ...

const eventStream = createEventStream(server, {path: `/sse`});
useDefaultLogging({ eventStream });


eventStream.send({ data: `something`,  event: `eventName`});
```

See [examples](./examples)


### License

[CC0](./license.txt)
