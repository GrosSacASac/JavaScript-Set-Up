"use strict";

var JS99 = (function () {
    "use strict";
    var alert99 = function alert99(event) {
        alert(event.target.value);
    };

    var explode = function explode(event) {
        alert("boom");
    };

    var isGoodPassword = function isGoodPassword(event) {
        if (event.target.value.length < 8) {
            alert("this Password is not secure");
        }
        //add more rules here ...
    };
    return Object.freeze({
        alert: alert99,
        explode: explode,
        isGoodPassword: isGoodPassword
    });
})();

/*usage:

*/