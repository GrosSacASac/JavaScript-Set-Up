import d from "./dom99.js";

d.functions.numberChange = function (event) {
    fetch(`/updateNumber`, {
        method: "PUT",
        body: String(d.variables.number),
        "content-type": "application/json",
        headers: {
          'Content-Type': 'application/json'
        }
    });
};

d.activate();
