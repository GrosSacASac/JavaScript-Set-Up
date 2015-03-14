"use strict";

/*
use DOM99.linkJsAndDom();
*/var DOM99 = (function () {
    "use strict";
    //it must start with "data-" see
    //https://docs.webplatform.org/wiki/html/attributes/data-*
    var dom99Prefix = "data-99",
        dom99AfterValue = "done";

    var walkTheDom = (function (_walkTheDom) {
        var _walkTheDomWrapper = function walkTheDom() {
            return _walkTheDom.apply(this, arguments);
        };

        _walkTheDomWrapper.toString = function () {
            return _walkTheDom.toString();
        };

        return _walkTheDomWrapper;
    })(function (node, aFunction) {
        aFunction(node);
        node = node.firstChild;
        while (node) {
            walkTheDom(node, aFunction);
            node = node.nextSibling;
        }
    });

    var addEventListener = function addEventListener(node, type, aFunction) {
        var useCapture = arguments[3] === undefined ? false : arguments[3];

        //add here attachEvent for old IE if you want
        node.addEventListener(type, aFunction, useCapture);
    };

    var onceAddEventListener = function onceAddEventListener(node, type, aFunction) {
        var useCapture = arguments[3] === undefined ? false : arguments[3];

        var tempFunction = (function (_tempFunction) {
            var _tempFunctionWrapper = function tempFunction() {
                return _tempFunction.apply(this, arguments);
            };

            _tempFunctionWrapper.toString = function () {
                return _tempFunction.toString();
            };

            return _tempFunctionWrapper;
        })(function (event) {
            //called once only
            aFunction(event);
            node.removeEventListener(type, tempFunction, useCapture);
        });
        addEventListener(node, type, tempFunction, useCapture);
    };

    var executeData99Directive = function executeData99Directive(node, directive) {
        var tokens = directive.split("-");
        addEventListener(node, tokens[0], JS99[tokens[1]]);
    };

    var tryExecuteData99Directive = function tryExecuteData99Directive(node) {
        if (node.hasAttribute && node.hasAttribute(dom99Prefix) && node.getAttribute(dom99Prefix) !== dom99AfterValue) {

            executeData99Directive(node, node.getAttribute(dom99Prefix));
            //ensure the directive is only executed once
            node.setAttribute(dom99Prefix, dom99AfterValue);
        }
    };

    var linkJsAndDom = function linkJsAndDom() {
        walkTheDom(document.body, tryExecuteData99Directive);
    };
    return Object.freeze({
        linkJsAndDom: linkJsAndDom
    });
})();

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