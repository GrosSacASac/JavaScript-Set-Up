"use strict";

var JS99 = (function () {
    "use strict";
    var _vars_ = {},
        _varListeners_ = {},
        _nodes_ = {};

    /* 
      define your event Listener here.
      You can use _vars_ and _nodes_
      _varListeners_ contains arrays of nodes , each array contains all nodes
        that listen to the same variable. You should have no good reason to use _varListeners_. Instead use _nodes_
        
      If you have this in your document <input data-99-var="a">
        --> you can then use _vars_.a or _vars_["a"] here
        --> you can then use JS99._vars_.a
            or               JS99._vars_.["a"] in your js
        all assignments will be reflected in the document
        
        
      If you have this in your document <div data-99-node="box1"></div>
        --> you can then use _nodes_.box1 or _nodes_["box1"]
        it is basically a short cut for getElementBy...()
      
    */

    var calculate = function calculate(event) {
        _vars_.result = parseInt(_vars_.a, 10) * parseInt(_vars_.b, 10);
    };

    return Object.freeze({
        _vars_: _vars_,
        _varListeners_: _varListeners_,
        _nodes_: _nodes_,

        calculate: calculate
    });
})();