"use strict";

/*
use DOM99.linkJsAndDom();
*/var DOM99 = (function () {
    "use strict";
    //it must start with "data-" see
    //https://docs.webplatform.org/wiki/html/attributes/data-*
    var dom99PrefixBind = "data-99-bind",
        dom99PrefixVar = "data-99-var",
        dom99PrefixNode = "data-99-node",
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

    var executeData99Bind = function executeData99Bind(node, directiveTokens) {
        if (JS99[directiveTokens[1]]) {
            addEventListener(node, directiveTokens[0], JS99[directiveTokens[1]]);
        } else {
            throw new Error("Function " + directiveTokens[1] + " not found in JS99");
        }
    };

    var executeData99Var = function executeData99Var(node, directiveTokens) {
        // two-way bind

        if (!Array.isArray(JS99._varListeners_[directiveTokens[0]])) {
            (function () {
                var x = undefined; //holds the value
                JS99._varListeners_[directiveTokens[0]] = [node];
                Object.defineProperty(JS99._vars_, directiveTokens[0], {
                    get: function get() {
                        return x;
                    },
                    set: function set(newValue) {
                        x = newValue;
                        JS99._varListeners_[directiveTokens[0]].forEach(function (node) {
                            if (node.value !== undefined) {
                                node.value = newValue;
                            } else {
                                node.textContent = newValue;
                            }
                        });
                    },
                    enumerable: true });
            })();
        } else {
            JS99._varListeners_[directiveTokens[0]].push(node);
        }

        JS99._vars_[directiveTokens[0]] = node.value;
        addEventListener(node, "input", function (event) {
            JS99._vars_[directiveTokens[0]] = event.target.value;
        });
    };

    var executeData99Node = function executeData99Node(node, directiveTokens) {
        //node that is used in other events
        if (!JS99._nodes_[directiveTokens[0]]) {
            JS99._nodes_[directiveTokens[0]] = node;
        } else {
            throw new Error("cannot have 2 nodes with the same name");
        }
    };

    var tryExecuteData99Directive = function tryExecuteData99Directive(node, prefix, execution) {
        if (node.hasAttribute(prefix) && node.getAttribute(prefix) !== dom99AfterValue) {
            execution(node, node.getAttribute(prefix).split("-"));
            //ensure the directive is only executed once
            node.setAttribute(prefix, dom99AfterValue);
        }
    };

    var tryExecuteData99Directives = function tryExecuteData99Directives(node) {
        if (node.hasAttribute) {
            tryExecuteData99Directive(node, dom99PrefixBind, executeData99Bind);
            tryExecuteData99Directive(node, dom99PrefixVar, executeData99Var);
            tryExecuteData99Directive(node, dom99PrefixNode, executeData99Node);
        }
    };

    var linkJsAndDom = function linkJsAndDom() {
        var startNode = arguments[0] === undefined ? document.body : arguments[0];

        walkTheDom(startNode, tryExecuteData99Directives);
    };
    return Object.freeze({
        linkJsAndDom: linkJsAndDom
    });
})();