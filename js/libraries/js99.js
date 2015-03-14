const JS99 = (function () {
    "use strict";
    const alert99 = function (event) {
        alert(event.target.value);
    };
    
    const explode = function (event) {
        alert(event.target.value);
    };
    
    const isGoodPassword = function (event) {
        alert(event.target.value);
    };
    return Object.freeze({
        "alert": alert99,
        "explode": explode,
        "isGoodPassword": isGoodPassword
    });
}());

/*usage:

*/