
const httpRequest = (function () {
    // inspired by jx
    
    const newHttpRequest = function() {
		return new XMLHttpRequest();
	};
    
    const defaultOptions = {format: "text", body: null, method: "GET"};
    
	const request = function (url, options = defaultOptions) {	
    /*
        url	- 
        options (optional) dictionaries with following options
            "format" defaults to "text" can be set "json"
            "body" = null
            "method" = "GET"
        returns a promise that resolves with a string or an object
    */
        return new Promise(function (resolve, reject) {
            const aHttpRequest = newHttpRequest();
            const optionsWithDefaults = {};
            Object.assign(optionsWithDefaults, defaultOptions);
            Object.assign(optionsWithDefaults, options);
            const {format, body, method} = optionsWithDefaults;
            
            aHttpRequest.open(method, url, true);

            aHttpRequest.onreadystatechange = function () {
                if (aHttpRequest.readyState == 4) {
                    if ((aHttpRequest.status >= 200) && (aHttpRequest.status < 300)) {
                        let result = "";
                        if (aHttpRequest.responseText) {
                            result = aHttpRequest.responseText;
                        }
                        //If the return is in JSON format, eval the result before returning it.
                        if (format === "json") {
                            try {
                                const resultObject = JSON.parse(result);
                                resolve(resultObject);
                            } catch (error) {
                                reject(error);
                            }
                        } else {
                            resolve(result);
                        }
                    } else { //An error occured
                        reject("HTTP status code not in the 200s");
                    }
                }
            }
            aHttpRequest.send(body);
        });
	};
	
    return {
        request
    };
}());
