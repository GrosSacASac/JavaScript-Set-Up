export { createHttpServer };

import http from "node:http";


const PORT = 8080;

const createHttpServer = () => {
    const server = http.createServer((req, res) => {

    });

    server.listen(PORT);
    console.log(`http listening on port ${PORT}`);

    return server;
};
