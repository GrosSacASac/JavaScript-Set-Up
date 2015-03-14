/*
use DOM99.linkJsAndDom();
*/const DOM99 = (function () {
    "use strict";
    const dom99Prefix = "data-99",
          dom99AfterValue = "done";
    
    const walkTheDom = function (node, aFunction) {
        aFunction(node);
        node = node.firstChild;
        while (node) {
            walkTheDom(node, aFunction);
            node = node.nextSibling;
        }
    };
    
    const addEventListener = function (node, type, aFunction, useCapture=false) {
        //add here attachEvent for old IE if you want
        node.addEventListener(type, aFunction, useCapture);
    };
    
    const onceAddEventListener = function (node, type, aFunction, useCapture=false) {
        var tempFunction = function (event) {
            //called once only
            aFunction(event);
            node.removeEventListener(type, tempFunction, useCapture)
        };
        addEventListener(node, type, tempFunction, useCapture);
    };
    
    const executeData99Directive = function (node, directive) {
        let tokens = directive.split("-");
        addEventListener(node, tokens[0], JS99[tokens[1]]);
    };
    
    const tryExecuteData99Directive = function (node) {
        if (node.hasAttribute && node.hasAttribute(dom99Prefix) &&
            node.getAttribute(dom99Prefix) !== dom99AfterValue) { 
            
            executeData99Directive(node, node.getAttribute(dom99Prefix));
            //ensure the directive is only executed once
            node.setAttribute(dom99Prefix, dom99AfterValue);
        }
    };
    
    const linkJsAndDom = function () {
        walkTheDom(document.body, tryExecuteData99Directive);
    }
    return Object.freeze({
        linkJsAndDom
    });
}());

/*usage:
in html 
data (must for custom attributes)
- (token separator)
99 (confirms that the attribute is for the 99 library)
input (type of event)
functionName (the event listener)
                0     1
<input data-99="input-alert">
*/