import { readFileSync } from "fs";
import polka from "polka";
import { makeSendFileAvailable } from "../sendFile.js";
import { dirname } from "path";
import url from "url";


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = polka();
app.use(makeSendFileAvailable);

const PORT = 8080;
const TIME_OUT_LIMIT = 1000 * 60 * 60;

const css = readFileSync(`./slide-show/css.css`);

const headLoaded = readFileSync(`./slide-show/headLoaded.js`);

const withSVG = readFileSync(`./diagrams/with.svg`);
const withoutSVG = readFileSync(`./diagrams/without.svg`);

const htmlStart = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>html streaming</title>
    <meta name="viewport" content="width=device-width">
    <style>${css}</style>
    <script>${headLoaded}</script>
</head>
<body>
<h1>HTML Streaming</h1>`;

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
        <h2>HTML Streaming</h2>
        <p>means the browsers start parsing before having it all</p>
    </section>`,
    `<section>
        <h2>Timing Controls</h2>
        <p>Control when a HTML tag is being displayed</p>
    </section>`,
    `<section>
        <h2>Real Time</h2>
        <p>Send data as it becomes available</p>
    </section>`,
    `<section>
        <h2>Using CSS to hide previous values</h2>
        <p><pre><code>p:not(:last-of-type) {
    display: none;
}</code></pre></p>
    </section>`,
    `<section>
        <h2>Using CSS to hide previous values</h2>
        <p><pre><code>p:not(:last-of-type) {
    display: none;
}</code></pre></p>
    </section>`,
    `<section>
        <h2>HTML Streaming to send data as soon as possible</h2>
        <p>${withSVG}</p>
    </section>`,
    `<section>
        <h2>Without</h2>
        <p>${withoutSVG}</p>
    </section>`,
    `<section>
        <h2>Limitations</h2>
        <p>The page loading indicator keeps spinning.</p>
        <p>Service worker pass through is limited.</p>
        <p>Incompatibility with existing tools.</p>
        <p>CSS selector last-of-type appears buggy sometimes.</p>
        <p>Additional work to make inputs.</p>
    </section>`,
    `<section>
        <h2>Timeouts</h2>
        <p><code>location.href = location.href;</code></p><p><code>meta http-equiv="refresh" content="230"</code></p>
        <p><code>server.timeout = TIME_OUT_LIMIT;</code></p>
    </section>`,
    `<section>
        <h2>Sources</h2>
        <p><a href="https://www.ebayinc.com/stories/blogs/tech/async-fragments-rediscovering-progressive-html-rendering-with-marko/">https://www.ebayinc.com/stories/blogs/tech/async-fragments-rediscovering-progressive-html-rendering-with-marko/</a>
        </p><p><a href="https://stackoverflow.com/questions/42589522/why-is-facebooks-html-wrapped-inside-a-table-mobile-login-page">https://stackoverflow.com/questions/42589522/why-is-facebooks-html-wrapped-inside-a-table-mobile-login-page</a>
        </p><p><a href="https://stackoverflow.com/questions/49515634/css-last-of-type-does-not-match-while-still-loading">https://stackoverflow.com/questions/49515634/css-last-of-type-does-not-match-while-still-loading</a></p>
    </section>`,
    `<section>
        <h2>Thanks</h2>
        <p></p>
    </section>`
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
