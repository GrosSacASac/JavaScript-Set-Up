"use strict";

var JS99 = (function () {
    "use strict";
    var _vars_ = {},
        _varListeners_ = {},
        _nodes_ = {};

    //define your event Listener here.
    //You can use _vars_ and _container_

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