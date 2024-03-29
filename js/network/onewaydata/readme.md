# onewaydata

[Server sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events) for NodeJs, works with raw http, express and polka.

to be used with [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource) client side.



## install

[npm i onewaydata](https://https://www.npmjs.com/package/onewaydata)

## usage

```js
import { 
    createEventStream,
    sendOne,
    RECONNECT,
    CONNECT,
    DISCONNECT,
} from "onewaydata";
import { useDefaultLogging } from "onewaydata/source/defaultLogging.js";


const server = ...
const condition = (request, response) => {
    return request.url === `/sse`;
};
const eventStream = createEventStream({server, condition, reconnectionTime: 5000 });
useDefaultLogging({ eventStream });


eventStream.send({ data: `data only`)});
eventStream.send({ data: `something`,  event: `eventName`, id: String(Date.now())});
eventStream.on(RECONNECT, ({lastId, response}) => {
    if (lastId) {
        // opportunity to resume with sendOne
        sendOne(response, `here is what you missed since last disconnection`);
    }
});

// eventStream.off(RECONNECT); // unsubscribe
// eventStream.close(); // closes all eventStream 
// eventStream.setAndSendId(); // shorthand to send id only and saving lastEventId
// same as send but takes a filter function 
eventStream.sendWithCondition({
    data: `latitude=434521, longitude=23213`,
    event: "fire started",
    function (request, response) {
        // request and response are from http because SSE is built on top of HTTP protocol
        // assumes some request have this property set before hand
        return request.isFirefighter; // only send to isFirefighter === true
    },
);
```

### with express/polka

The main difference is that the path is handled at the web framework level.

```js
import { createEventStream } from "onewaydata";
import polka from "polka";


const polkaServer = polka();
const eventStream = createEventStream({ asMiddleWare: true });
polkaServer.use(`/sse`, eventStream.middleWare);
polkaServer.listen(PORT);

eventStream.send({ data: `something`,  event: `eventName`});
```

See [examples](./examples)


## Extras

### More information

https://hpbn.co/server-sent-events-sse/


### Changelog

[changelog.md](./changelog.md)

### License

[CC0](./license.txt)
