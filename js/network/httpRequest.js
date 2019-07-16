export { httpRequest, defaultOptions }


const defaultOptions = {
    format: `text`,
    body: null,
    method: `GET`
};

/* returns a promise that resolves with a string or an object 
httpRequest('https://example.com/').then(console.log) */
const httpRequest = function (url, options) {
    return new Promise(function (resolve, reject) {
        const aHttpRequest = new XMLHttpRequest();
        const optionsWithDefaults = Object.assign({}, defaultOptions, options);
        const { format, body, method } = optionsWithDefaults;

        aHttpRequest.open(method, url, true);

        aHttpRequest.onreadystatechange = function () {
            if (aHttpRequest.readyState == 4) {
                if (aHttpRequest.status >= 400) {
                    reject(`HTTP status code not in the 200s`);
                    return;
                }
                let result = ``;
                if (aHttpRequest.responseText) {
                    result = aHttpRequest.responseText;
                }
                //If the return is in JSON format, eval the result before returning it.
                if (format === `json`) {
                    try {
                        const resultObject = JSON.parse(result);
                        resolve(resultObject);
                    } catch (error) {
                        reject(error);
                    }
                    return;
                }
                resolve(result);
            }
        };
        aHttpRequest.send(body);
    });
};
