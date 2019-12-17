// draft
import http from "http";
import fs from "fs";

const PORT = 8000;
const staticsPath = `./`;
const FORM_URLENCODED = `application/x-www-form-urlencoded`;
const FORM_BYTES = `multipart/form-data`;

const staticResponses = {
    [`/form.html`]: {
        [`file`]: `${staticsPath}/form.html`,
        [`Content-Type`]: `text/html`
    },
};

const handleStatic = (request, response) => {
    if (staticResponses.hasOwnProperty(request.url)) {
        response.writeHead(200, {[`Content-Type`]: staticResponses[request.url][`Content-Type`]});
        fs.createReadStream(staticResponses[request.url][`file`]).pipe(response);
    } else {
        response.writeHead(404, {[`Content-Type`]: `text/plain`});
        response.end(`404 Wrong url - not found`);
    }
};

const handleSubmit = (request, response) => {
    if (request.headers[`content-type`] !== FORM_URLENCODED && !request.headers[`content-type`].includes(FORM_BYTES)) {

        response.write(`not ok`);
        response.write(request.headers[`content-type`]);
        response.end();
        return;
    }
    const buffers = [];
    request.on(`data`, buffer => {
        buffers.push(buffer);
    });
    request.on(`end`, () => {
        const asString = buffers.map(String).join(``);
        console.log(asString);
        response.write(asString);
        response.end();
    });
};


const server = http.createServer((request, response) => {
  if (request.method === `GET`) {
      handleStatic(request, response);
      return;
  }
  if (request.method === `POST` && request.url === `/submit`) {
      handleSubmit(request, response);
      return;
  }
    console.log(request.url);
  response.setHeader(`Content-Type`, `text/plain`);
  response.writeHead(405);
  response.end(`Only use GET please`);
});



const start = function () {
    server.listen(PORT);
    console.log(`Listening on ${PORT}`);
};

start();
