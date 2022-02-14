export {
    createEventStream,
    sendOne,
    RECONNECT,
    CONNECT,
    DISCONNECT,
};
import Emitter from "event-e3/event-e3.js";


const MIME = `text/event-stream`;
const LAST_ID = (`Last-Event-ID`).toLowerCase(); // node request.headers is lower cased
const HTTP_OK = 200;
const HTTP_PROBLEM = 400;

// SSE fields 
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
    if (data) {
        data.split(`\n`).filter(Boolean).forEach(line => {
            message = `${message}${DATA}:${line}\n`;
        });
    }
    message = `${message}\n`;
    return message;
};

const sendOne = (response, messageObject) => {
    const message = formatEvent(messageObject);
    response.write(message);
};

const isValidRequestForServerSentEvents = (request) => {
    if (request.method !== `GET`) {
        return;
    }

    if (!request.headers?.accept.includes(MIME)) {
        return;
    }
    return true;
};


const createEventStream = (options) => {
    const { condition, server, asMiddleWare, reconnectionTime = 10 ** 4 } = options;
    const eventStream = Emitter({ lastEventId: 0 });

    let responses = [];
    let requests = [];
    let onRequest;

    const requestHandler = (request, response) => {
        if (!isValidRequestForServerSentEvents(request)) {
            response.writeHead(HTTP_PROBLEM);
            response.end();
            return false;
        }

        const { socket } = request;
        socket.setTimeout(0);
        socket.setKeepAlive(true);
        socket.setNoDelay(true);

        response.writeHead(HTTP_OK, {
            [`Content-Type`]: MIME,
        });
        responses.push(response);
        requests.push(request);

        const lastId = request.headers[LAST_ID];
        if (lastId) {
            // opportunity to resume with sendOne
            eventStream.emit(RECONNECT, {
                lastId,
                response,
            });
        } else {
            response.write(`${RETRY}: ${reconnectionTime}\n\n`)
        }

        socket.once(`close`, () => {
            const index = responses.indexOf(response);
            if (index !== -1) {
                responses.splice(index, 1);
                requests.push(index, 1);
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
        responses = undefined;
        requests = undefined;
        eventStream.off()
    };

    const setAndSendId = (id) => {
        eventStream.lastEventId = id;
        const message = formatId(id);
        responses.forEach(response => {
            response.write(message);
        });
    };

    const send = (messageObject) => {
        const message = formatEvent(messageObject);
        responses.forEach(response => {
            response.write(message);
        });
    };

    const sendWithCondition = (messageObject, condition) => {
        const message = formatEvent(messageObject);
        responses.forEach((response, i) => {
            if (condition(requests[i], response)) {
                response.write(message);
            }
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
            if (condition(request)) {
                requestHandler(request, response);
            }
        };
        server.on(`request`, onRequest);
    }

    return Object.assign(eventStream, {
        send,
        sendWithCondition,
        setAndSendId,
        close,
    });
};
