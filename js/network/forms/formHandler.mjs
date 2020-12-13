// draft
import http from "http";
import formidable from "formidable";
import fs from "fs";
import url from "url";
import path from "path";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const upload = `upload`
const staticsPath = `/`;
const FORM_URLENCODED = `application/x-www-form-urlencoded`;
const FORM_BYTES = `multipart/form-data`;

const staticResponses = {
    [`/form.html`]: {
        [`file`]: `${__dirname}${staticsPath}form.html`,
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
  if (request.method === `POST` && request.url === `/submitFormidable`) {
      console.log(`make sure to create ${__dirname}/${upload} before`)
    const form = formidable({ 
        multiples: true,
        uploadDir: `${__dirname}/${upload}`,
        keepExtensions: true,
        maxFileSize: 10**10,
        maxFields: 0, // 0 makes it infinite,
        maxFieldsSize: 10 ** 6
    });

    form.parse(request, (err, fields, files) => {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify({ fields, files }, null, 2));
    });
    return;
  }
  console.log(request.url);
  response.setHeader(`Content-Type`, `text/plain`);
  response.writeHead(405);
  response.end(`Only use GET please`);
});



const start = function () {
    server.listen(PORT);
    console.log(`Listening on ${PORT} try
http://localhost:8000/form.html`);
};

start();
