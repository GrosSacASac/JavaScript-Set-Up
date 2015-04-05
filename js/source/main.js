/*globals:DOM99, JS99*/
(function () {
    "use strict";
    
    // 1 define functions
    const calculate = function (event) {
        /*
        JS99.vars.result = String(parseInt(JS99.vars.a, 10) * parseInt(JS99.vars.b, 10));
         or write */
        JS99.changeVars({
            result: String(parseInt(JS99.vars.a, 10) * parseInt(JS99.vars.b, 10))
        });
    };

    // 2 store event handlers in JS99
    JS99.calculate = calculate;
    
    // 3 do the translations
    /* aquire the wanted lang in #en from the URL
       defaults to the user's own locale 
    if (location.hash) {
        location.hash.substr(1);	
    }*/
    DOM99.doTranslations();
    
    // 4 Link the document and the event handlers
    DOM99.linkJsAndDom(); //now we listen to events

    // 5 initialize
    JS99.changeVars({
        a: String(2),
        b: String(4),
    });
    JS99.calculate();
}());
