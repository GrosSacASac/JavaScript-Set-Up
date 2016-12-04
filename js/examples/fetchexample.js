//see https://fetch.spec.whatwg.org/#dom-global-fetch

const headers = new Headers({ "Content-Type": "application/json"});//can have more
const input = "something.json";//input can be an URL string or Request instance
const options = {//dont forget , if you remove some comments
    method: "GET", //list of safe methods https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html,
    headers: headers,
    body: "" /*//Blob or BufferSource or FormData or URLSearchParams or USVString
    referrer: "",//string
   referrerPolicy: "", 
   //https://w3c.github.io/webappsec-referrer-policy/#enumdef-referrerpolicy
   mode: RequestMode,
   credentials: RequestCredentials,
   cache: RequestCache,
   redirect: RequestRedirect,
   integrity: String,
    keepalive: false,
*/
};

//options is optional
fetch(input, options).then(function (response) {
/*
    most properties are read only, can use response.clone() or new Response()
    response.url // String
    response.redirected; // boolean
    response.status; // short Number
    response.ok; // boolean 
    response.statusText; // String
    response.headers; // Headers
    response.body; // null or ReadableStream;
    
    the following return Promises:
    response.text(); 
    response.arrayBuffer();
    response.blob();
    response.formData();
    response.json();

*/
    return response.text();
}).then(function(text) {
    const anObject = JSON.parse(text);
    //...
});
