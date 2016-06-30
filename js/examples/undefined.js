/*how to get undefined ? */

const isUndefinedSafe = function (x) {
    /*works even if undefined has been changed*/
    return x === void 0;
};

const toTest = []; // at the end we test everything inside


//0 use undefined
toTest.push(undefined);

//1 use void 0
toTest.push(void 0);


//2 use an unassigned variable
let a;
toTest.push(a);

//3 works with object members too, also with Maps
const myObject = {};
toTest.push(myObject.abcde);

//4 use a function with an implicit return undefined
const returnUndefined = function () {
    return;
};
toTest.push(returnUndefined());

//4 use an empty function with an implicit return
const returnUndefined2 = function () {};
toTest.push(returnUndefined2());

//5 use an empty function with an implicit return just once
// there also other ways to write this (for example with the function constructor
toTest.push((function () {}()));

//6 use an empty slot that evaluates to undefined
const arrayWithEmptySlots = new Array(5);
toTest.push(arrayWithEmptySlots[0]);
// or 
toTest.push((Array(1))[0]); // 1liner


//7 are there other ways ?

/*Now tests the results*/
console.log("all above should be true: " + toTest.every(function (maybeUndefined) {
    return isUndefinedSafe(maybeUndefined);
})); // should print true