import express from "express";
import { dirname } from "path";
import url from "url";


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {json} = express;
const app = express();
const jsonMiddleWare = json({strict: false});

const PORT = 8081;
const TIME_OUT_LIMIT = 1000 * 60 * 60;

const htmlStart = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>html streaming</title>
    <meta name="viewport" content="width=device-width">
    <style>p:not(:last-of-type) {
        display: none;
    }</style>
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


let number = `0`;
const subScribers = [];
app.get('/', (request, response) => response.sendFile(`${__dirname}/controller.html`));
app.get('/controller.js', (request, response) => response.sendFile(`${__dirname}/controller.js`));
app.get('/dom99.js',
    (request, response) => response.sendFile(`${__dirname}/node_modules/dom99/built/dom99ES.js`));

app.get('/viewer', function (request, response) {
    response.setHeader(`Content-Type`, `text/html`);
    response.writeHead(200);
    response.write(htmlStart);
    response.write(`<p>${number}</p>`);
    subScribers.push(response);
    // call this to close response.end(htmlEnd);
});

app.put('/updateNumber', jsonMiddleWare, function (request, response) {
    number = request.body;
    subScribers.forEach(function (responseSubscriber) {
        responseSubscriber.write(`<p>${number}</p>`);
    });
    response.writeHead(204);
    response.end();
});

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
server.timeout = TIME_OUT_LIMIT;
