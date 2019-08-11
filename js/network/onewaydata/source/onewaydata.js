export {
    createEventStream,
    sendOne,
    RECONNECT,
    CONNECT,
    DISCONNECT,
    defaultChannel,
};
import Emitter from "event-e3/event-e3.js";


const MIME = `text/event-stream`;
const LAST_ID = `Last-Event-ID`;
const defaultChannel = `message`;

// fields
const DATA = `data`;
const ID = `id`;
const EVENT = `event`;
const RETRY = `retry`;

const RECONNECT = Symbol();
const CONNECT = Symbol();
const DISCONNECT = Symbol();


const formatSimpleMessage = (x) => {
    return `${DATA}:${x}\n\n`;
};

const formatId = (id) => {
    return `${ID}:${id}\n\n`;
};

const formatEvent = (x) => {
    if (typeof x === `string`) {
        return formatSimpleMessage(x);
    }

    const { id, event, data } = x;
    let message = ``;
    if (id) {
        message = `${ID}:${id}\n`;
    }
    if (event) {
        message = `${message}${EVENT}:${event}\n`;
    }
    if (data && data !== defaultChannel) {
        message = `${message}${DATA}:${data}\n`;
    }
    message = `${message}\n`;
    return message;
};

const sendOne = (response, x) => {
    const message = formatEvent(x);
    response.write(message);
};

const isValidRequestForServerSentEvents = (request) => {
    if (request.method !== `GET`) {
        return;
    }

    if (request.headers.accept && !request.headers.accept.includes(MIME)) {
        return;
    }
    return true;
};


const createEventStream = (options) => {
    const { path, server, asMiddleWare } = options;
    const eventStream = Emitter({ lastEventId: 0 });

    let responses = [];
    let onRequest;

    const requestHandler = (request, response) => {
        if (!isValidRequestForServerSentEvents(request)) {
            return false;
        }

        const { socket } = request;
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
            eventStream.emit(RECONNECT, {
                lastId,
                response
            });
        }

        socket.once(`close`, () => {
            const index = responses.indexOf(response);
            if (index !== -1) {
                responses.splice(index, 1);
                eventStream.emit(DISCONNECT, { response });
            }
        });
        eventStream.emit(CONNECT, { response });
        return true;
    };

    const close = () => {
        if (!asMiddleWare) {
            server.off(`request`, onRequest);
        }
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
        const message = formatEvent(x);
        responses.forEach(response => {
            response.write(message);
        });
    };

    if (asMiddleWare) {
        eventStream.middleWare = (request, response, next) => {
            const handled = requestHandler(request, response);
            if (!handled) {
                next();
            }
        };
    } else {
        onRequest = (request, response) => {
            const requestPath = request.url;
            if (requestPath !== path) {
                return;
            }
            requestHandler(request, response, responses);
        };
        server.on(`request`, onRequest);
    }

    return Object.assign(eventStream, {
        send,
        setAndSendId,
        close,
    });
};
