/* from worka/example */
export { makeSendFileAvailable };
import { createReadStream } from "fs";
import path from "path";


/* from 3D-realtime-editor */
const mimeDictionairy = {//add more as you need
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};
const makeSendFileAvailable = function (req, res, next) {
    res.sendFile = sendFile;
    next();
};

const sendFile = function (filePath) {
    const res = this;
    const extname = path.extname(filePath);
    const contentType = mimeDictionairy[extname];
    res.setHeader('Content-Type', contentType);
    createReadStream(filePath).pipe(res);
};
