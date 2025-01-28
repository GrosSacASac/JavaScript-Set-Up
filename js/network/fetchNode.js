import fs from "node:fs";
// import mime from "mime";
const mime = {// fake mime
    getType(filePath) {
        return "text/markdown";
    }
};

const blobPromiseFromStream = (stream, mimeType) => {
    return new Response(stream, {headers: new Headers({'Content-Type':  mimeType})}).blob();
}


const url = "http://localhost:3000/api/upload";
const filename = "README.md"
const pathToImage = `./${filename}`;
const blob1 = await blobPromiseFromStream(fs.createReadStream(pathToImage), mime.getType(pathToImage));


const form = new FormData();
form.append("file", blob1, filename);


fetch(url , {
    method: 'POST',
    body: form,
    // headers: new Headers(),
}).then((response) => {
    if (!response.ok) {
        console.error(response);
        return;
    }
    return response.text();
}).catch((error) => {
    console.error(error);
}).then((text) => {
    console.log(text);
});