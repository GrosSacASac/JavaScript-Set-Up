"use strict";

const express = require(`express`);
const app = express();

const PORT = 8080;
const TIME_OUT_LIMIT = 1000 * 60 * 60;


const htmlStart = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>html streaming</title>
    <meta name="viewport" content="width=device-width">
    <style>

section {
    position: absolute;
    left: 0;
    right: 0;
}

section:last-of-type {
    animation: comin 1.4s ease 0s;
    left: 0;
    opacity: 1;
}

@keyframes comin {
    0% {
      left: 100%;
    }
    100% {
      left: 0;
    }
}

section:not(:last-of-type) {
   animation: comout 1.4s ease 0s;
   left: -100%;
   opacity: 0;
}

@keyframes comout {
    0% {
      left: 0;
      opacity: 1;
    }
    100% {
      left: -100%;
      opacity: 0;
    }
}
</style>
    <script>
        var headLoaded = Date.now();
        document.addEventListener("DOMContentLoaded", function() {
           console.log((Date.now() - headLoaded) / 1000);
         });
    </script>
</head>
<body>
<h1>Viewer</h1>`;

const htmlEnd = `
</body>
</html>`;


let number = 0;

const slides = [
    `<section>
        <h2>HTML Streaming</h2>
        <p>presentation by Cyril Walle</p>
    </section>`,
    `<section>
        <h2>2</h2>
        <p>22222222222222</p>
    </section>`,
    `<section>
        <h2>3</h2>
        <p>33333333333</p>
    </section>`,
];
const subScribers = [];
app.get(`/`,
    (request, response) => response.sendFile(`${__dirname}/slide-controller.html`));
app.get(`/built-slide-controller.js`,
    (request, response) =>  response.sendFile(`${__dirname}/built-slide-controller.js`));

app.get(`/viewer`, function (request, response) {
    response.setHeader(`Content-Type`, `text/html`);
    response.writeHead(200);
    response.write(htmlStart);
    response.write(slides[number]);
    subScribers.push(response);
    // call this to close response.end(htmlEnd);
});

app.post(`/slideChange`, function (request, response) {
    //number = request.body;
    subScribers.forEach(function (responseSubscriber) {
        number = (number + 1) % slides.length;
        responseSubscriber.write(slides[number]);
        // console.log(number);
    });
    response.writeHead(204);
    response.end();
});

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
server.timeout = TIME_OUT_LIMIT;
