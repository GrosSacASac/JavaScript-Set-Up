const JS99 = (function () {
    "use strict";
    let _vars_ = {},
        _varListeners_ = {},
        _nodes_ = {};
        
    //define your event Listener here.
    //You can use _vars_ and _container_
    
    
    
    const calculate = function (event) {
        _vars_["result"] = parseInt(_vars_["a"], 10) * parseInt(_vars_["b"], 10);
    };
    
    return Object.freeze({
        _vars_,
        _varListeners_,
        _nodes_,
        
        calculate
    });
}());
