/*
use DOM99.linkJsAndDom();
*/const DOM99 = (function () {
    "use strict";
    //it must start with "data-" see
    //https://docs.webplatform.org/wiki/html/attributes/data-*
    const dom99PrefixBind = "data-99-bind",
          dom99PrefixVar = "data-99-var",
          dom99PrefixNode = "data-99-node",
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
    
    const executeData99Bind = function (node, directiveTokens) {
        if (JS99[directiveTokens[1]]) {
            addEventListener(node, directiveTokens[0], JS99[directiveTokens[1]]);
        } else {
            throw new Error(`Function ${directiveTokens[1]} not found in JS99`);
        }
    };
    
    const executeData99Var = function (node, directiveTokens) {
        // two-way bind
        
        if (!Array.isArray(JS99["_varListeners_"][directiveTokens[0]])) {
            let x; //holds the value
            JS99["_varListeners_"][directiveTokens[0]] = [node];
            Object.defineProperty(JS99["_vars_"], directiveTokens[0], {
                get: function () {
                    return x;
                },
                set: function (newValue) {
                    x = newValue;
                    JS99["_varListeners_"][directiveTokens[0]].forEach(function (node) {
                        if (node.value !== undefined){
                            node.value = newValue;
                        } else {
                            node.textContent = newValue;
                        }
                    });
                },
                enumerable: true,
            });
        } else {
            JS99["_varListeners_"][directiveTokens[0]].push(node);
        }
        
        JS99["_vars_"][directiveTokens[0]] = node.value;
        addEventListener(node, "input",  function (event) {
            JS99["_vars_"][directiveTokens[0]] = event.target.value;
        });
    };
    
    const executeData99Node = function (node, directiveTokens) {
        //node that is used in other events
        if (!JS99["_nodes_"][directiveTokens[0]]) {
            JS99["_nodes_"][directiveTokens[0]] = node;
        } else {
            throw new Error("cannot have 2 nodes with the same name");
        }
    };
    
    const tryExecuteData99Directive = function (node, prefix, execution) {
        if (node.hasAttribute(prefix) &&
            node.getAttribute(prefix) !== dom99AfterValue) {
            execution(node, node.getAttribute(prefix).split("-"));
            //ensure the directive is only executed once
            node.setAttribute(prefix, dom99AfterValue);
        }
    };
    
    const tryExecuteData99Directives = function (node) {
        if (node.hasAttribute) {
            tryExecuteData99Directive(node, dom99PrefixBind, executeData99Bind);
            tryExecuteData99Directive(node, dom99PrefixVar, executeData99Var);
            tryExecuteData99Directive(node, dom99PrefixNode, executeData99Node);
        }
    };
    
    const linkJsAndDom = function (startNode=document.body) {
        walkTheDom(startNode, tryExecuteData99Directives);
    };
    return Object.freeze({
        linkJsAndDom
    });
}());
