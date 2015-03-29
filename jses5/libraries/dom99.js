"use strict";

var DOM99 = (function () {
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

    //not used yet
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
        //format: directiveTokens[0] comma separated event types
        //directiveTokens[1] the name of the function
        if (JS99[directiveTokens[1]]) {
            directiveTokens[0].split(",").forEach(function (eventType) {
                addEventListener(node, eventType, JS99[directiveTokens[1]]);
            });
        } else {
            throw new Error("Function " + directiveTokens[1] + " not found in JS99");
        }
    };

    var executeData99Var = function executeData99Var(node, directiveTokens) {
        // two-way bind

        if (!JS99.varListeners[directiveTokens[0]] || !Array.isArray(JS99.varListeners[directiveTokens[0]])) {
            (function () {
                var x = undefined; //holds the value
                JS99.varListeners[directiveTokens[0]] = [node];
                Object.defineProperty(JS99.vars, directiveTokens[0], {
                    get: function get() {
                        return x;
                    },
                    set: function set(newValue) {
                        if (newValue === undefined) {
                            return;
                        }
                        x = newValue;
                        JS99.varListeners[directiveTokens[0]].forEach(function (node) {
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
            JS99.varListeners[directiveTokens[0]].push(node);
        }

        JS99.vars[directiveTokens[0]] = node.value;
        addEventListener(node, "input", function (event) {
            JS99.vars[directiveTokens[0]] = event.target.value;
        });
    };

    var executeData99Node = function executeData99Node(node, directiveTokens) {
        //node that is used in other events
        if (!JS99.nodes[directiveTokens[0]]) {
            JS99.nodes[directiveTokens[0]] = node;
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