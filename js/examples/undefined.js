/*how to get undefined ? */

const isUndefinedSafe = function (x) {
    /*works even if undefined has been changed*/
    return x === void 0;
};

const toTest = []; // at the end we test everything inside


//0 use undefined
toTest.push(isUndefinedSafe(undefined));

//1 use void 0
toTest.push(isUndefinedSafe(void 0));


//2 use an unassigned variable
let a;
toTest.push(isUndefinedSafe(a));

//3 works with object members too, also with Maps
const myObject = {};
toTest.push(isUndefinedSafe(myObject.abcde));

//4 use a function with an implicit return undefined
const returnUndefined = function () {
    return;
};
toTest.push(isUndefinedSafe(returnUndefined()));

//4 use an empty function with an implicit return
const returnUndefined2 = function () {};
toTest.push(isUndefinedSafe(returnUndefined2()));

//5 use an empty function with an implicit return just once
// there also other ways to write this (for example with the function constructor
toTest.push(isUndefinedSafe((function () {}())));

//6 are there other canonical ways ?

/*Now tests the results*/
console.log("all assertions above are " + toTest.every(function (bool) {
    return bool;
})); // should print true