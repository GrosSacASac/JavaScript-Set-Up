"use strict";

/*globals:DOM99, JS99*/
(function () {
    "use strict";

    // 1 define functions
    var calculate = function calculate(event) {
        /*
        JS99.vars.result = String(parseInt(JS99.vars.a, 10) * parseInt(JS99.vars.b, 10));
         or write */
        JS99.change({
            result: String(parseInt(JS99.vars.a, 10) * parseInt(JS99.vars.b, 10))
        });
    };

    // 2 store event handlers in JS99
    JS99.calculate = calculate;

    // 3 Link the document and the event handlers
    DOM99.linkJsAndDom(); //now we listen to events

    // 4 initialize
    JS99.vars.a = 0;
    JS99.vars.b = 1;
    JS99.calculate();
})();