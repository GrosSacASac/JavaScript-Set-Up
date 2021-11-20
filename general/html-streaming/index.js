import { createServer } from "node:http";

const PORT = 8080;

const htmlStart = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>html streaming</title>
    <meta name="viewport" content="width=device-width">
    <script>
        var headLoaded = Date.now();
        document.addEventListener("DOMContentLoaded", function() {
           console.log((Date.now() - headLoaded) / 1000);
         });
    </script>
</head>
<body>`;

const htmlEnd = `
</body>
</html>`;

const htmlInsideBody = `<h1 id="html-streaming">HTML Streaming</h1>
<p>HTML streaming is a browser feature. Streaming in programming is a gerneral purpose word to define a continous process as opposed to a long stand alone blocking one. Streaming with video means playing the first seconds while the rest is still downloading. In HTML it means that while the HTML document is still being downloaded, the first parts are already parsed and executed. That is why it is generally a good idea to put <code>&lt;style&gt;</code> as early as possible in the HTML document. From an user's persective, that is very convenient, the user can already read the first paragraph, while the rest of the document is still being downloaded. Nowadays, to experience the benefits of this feature, visit a page with a big document on a low brandwidth connection.</p>
<h2 id="downloading-is-a-multy-party-process">Downloading is a Multy Party Process</h2>
<p>There is a sender and a receiver. The receiver, in our case, a web browser can process received information before having received all of it. It can also pause, resume and cancel the process. The sender, a web server, can also pause, resume and cancel the process. The implication is that the sender can precisely control the timing.</p>
<h2 id="timing-controls">Timing Controls</h2>
<p>The web server can control the timings, in other words, control when a HTML tag is being displayed. To demonstrade this capability: <code>npm run demo1</code>. In this example the response is split into individual letters with <code>.split(\`\`)</code>. They are then send one by one with a delay using <code>setInterval()</code>. The visual effect is living text being written, streamed.</p>
<h2 id="leveraging-html-streaming-for-real-time-web-apps">Leveraging HTML Streaming for Real Time Web Apps</h2>
<p>Extending the previous example, it is possible to display any real time data that the server receives while the connection is open. To demonstrate this, two routes are created: <code>controller</code> and <code>viewer</code>. Controller contains an <code>&lt;input type="number"&gt;</code> that uses web sockets to send its last value when it change. Viewer, displays that last value using HTML streaming. The problem is that old values are still in there, because old nodes are not removed.</p>
<h2 id="using-css-to-hide-previous-values">Using CSS to hide previous values</h2>
<p>The following CSS hides all but the last paragraph:</p>
<pre class="editor-colors lang-"><div class="line"><span class="syntax--text syntax--plain syntax--null-grammar"><span>p:not(:last-of-type)&nbsp;{</span></span></div><div class="line"><span class="syntax--text syntax--plain syntax--null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;display:&nbsp;none;</span></span></div><div class="line"><span class="syntax--text syntax--plain syntax--null-grammar"><span>}</span></span></div></pre><h2 id="html-streaming-to-send-data-as-soon-as-possible">HTML Streaming to send data as soon as possible</h2>
<p>In a typical dynamic website a request to a page from a logged user shows a page with static content, dynamic content and user specific content. Without HTML streaming all has to be loaded before anything has to be sent. With HTML streaming, the early parts of HTML can be sent while a database query is going on. The rest is then sent as soon as possible. This can reduce the time the user sees a blank page.</p>
<p>With html streaming <img alt="with" src="C:\files\github\JavaScript-Set-Up\general\html-streaming\diagrams\with.svg"></p>
<p>Without html streaming <img alt="without" src="C:\files\github\JavaScript-Set-Up\general\html-streaming\diagrams\without.svg"></p>
<h2 id="details">Details</h2>
<h3 id="iframes-for-multiple-html-streaming-sources"><code>&lt;iframe&gt;</code>s for multiple HTML Streaming sources</h3>
<h3 id="td-as-an-escape-hatch-to-html-streaming"><code>&lt;td&gt;</code> as an Escape Hatch to HTML Streaming</h3>
<p>The content of <code>&lt;td&gt;</code> is not rendered at all until the entire row has been received.</p>
<h2 id="limitation">Limitation</h2>
<p>The page loading indicator keeps spinning.</p>
<p>Service worker pass through is limited.</p>
<h3 id="timeouts">Timeouts</h3>
<p>HTTP streaming stops after a certain amount of time, for example after 120 seconds after the last TCP frame was received. So this is a problem if there are long pauses in between two <code>response.write</code></p>
<p>One solution could be to listen for the document loaded event and when it occurs do refresh with js <code>location.href = location.href;</code>, or with html <code>&lt;meta http-equiv="refresh" content="230"</code>.</p>
<p>In NodeJS the HTTP timeout can be extedend with <code>server.timeout = TIME_OUT_LIMIT;</code></p>
<h2 id="sources">Sources</h2>
<p><a href="https://www.ebayinc.com/stories/blogs/tech/async-fragments-rediscovering-progressive-html-rendering-with-marko/">https://www.ebayinc.com/stories/blogs/tech/async-fragments-rediscovering-progressive-html-rendering-with-marko/</a>
<a href="https://stackoverflow.com/questions/42589522/why-is-facebooks-html-wrapped-inside-a-table-mobile-login-page">https://stackoverflow.com/questions/42589522/why-is-facebooks-html-wrapped-inside-a-table-mobile-login-page</a></p>`.split(``);

const INTERVAL = 25; // ms
const server = createServer((request, response) => {
  response.setHeader(`Content-Type`, `text/html`);
  response.writeHead(200);
  response.write(htmlStart);
  let i = 0;
  let intervalId = setInterval(function () {
        response.write(htmlInsideBody[i]);
        i += 1;
        if (i === htmlInsideBody.length) {
            clearInterval(intervalId);
            response.end(htmlEnd);
        }
  }, INTERVAL);
});

server.listen(PORT);
console.log(`Listening on ${PORT}`);
