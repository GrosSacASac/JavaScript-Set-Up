// Abstract constructor 
// spec is an object I use as specification 
// By being an object you can specify arguments in whichever order you like
// add defaults as you please, etc, it is very flexible
function constructor(spec){
    // 1. initialize own members from spec
    let {member} = spec;

    // 2. composition with other objects
    // you can select only the parts that you want to use
    // you only "inherit" the stuff that you need
    let {other} = other_constructor(spec);

    // 3. methods
    let method = function(){ // close over other methods, variables and spec };

    // 4. Expose public API
    // Note new ES6 that lets you define object properties like this:
    // {method, other}
    // instea of
    // { method : method, other : other}
    return Object.freeze({ // immutable (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
            method,
            other
        });
    }
}