export {
    createEventStream,
    sendOne,
    RECONNECT_EVENT,
    CONNECT_EVENT,
    DISCONNECT_EVENT
};
import Emitter from "event-e3";

const MIME = `text/event-stream`;
const LAST_ID = `Last-Event-ID`;
const DATA = `data`;
const ID = `id`;
const EVENT = `event`;
const RETRY = `retry`;

const RECONNECT_EVENT = Symbol();
const CONNECT_EVENT = Symbol();
const DISCONNECT_EVENT = Symbol();

const formatMessage = (x) => {
    return `${DATA}:${x}\n\n`;
};

const formatId = (id) => {
    return `${ID}:${id}\n\n`;
};

const sendOne = (response, x) => {
    const message = formatMessage(x);
    response.write(message);
};

const isValidRequestForServerSentEvents = (request, expectedPath) => {
    const requestPath = request.url;
    if (requestPath !== expectedPath) {
        return;
    }

    if (request.method !== `GET`) {
        return;
    }

    if (request.headers.accept && !request.headers.accept.includes(MIME)) {
        return;
    }
    return true;
};

const createEventStream = (server, options) => {
    const {path} = options;
    const eventStream = Emitter({lastEventId: 0});

    let responses = [];

    const onRequest = (request, response) => {
        if (!isValidRequestForServerSentEvents(request, path)) {
            return;
        }

        const {socket} = request;
        socket.setTimeout(0);
        socket.setKeepAlive(true);
        socket.setNoDelay(true);

        response.writeHead(200, {
            [`Content-Type`]: MIME
        });
        responses.push(response);

        const lastId = request.headers[LAST_ID];
        if (lastId) {
            // opportunity to resume with sendOne
            eventStream.emit(RECONNECT_EVENT, {
                lastId,
                response
            });
        }

        socket.once(`close`, () => {
            const index = responses.indexOf(response);
            if (index !== -1) {
                responses.splice(index, 1);
                eventStream.emit(DISCONNECT_EVENT, {response});
            }
        });
        eventStream.emit(CONNECT_EVENT, {response});
    };

    const close = () => {
        server.off(`request`, onRequest);
        responses.forEach(response => {
            response.end();
        });
        responses = [];
    };

    const setAndSendId = (id) => {
        eventStream.lastEventId = id;
        const message = formatId(id);
        responses.forEach(response => {
            response.write(message);
        });
    };

    const send = (x) => {
        const message = formatMessage(x);
        responses.forEach(response => {
            response.write(message);
        });
    };

    server.on(`request`, onRequest);

    return Object.assign(eventStream, {
        send,
        setAndSendId,
        close
    });
};