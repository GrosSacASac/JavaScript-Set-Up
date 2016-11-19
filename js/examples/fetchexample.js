
fetch("something.json").then(function (response) {
    return response.text();
}).then(function(text) {
    const anObject = JSON.parse(text);
    //...
});
