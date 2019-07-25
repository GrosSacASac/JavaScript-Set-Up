/* various ways to if else */

/* if */

if (condition) {
    // if statements
}


/* if else */

if (boolean1) {
    //statements 1
} else {
    //statements else
}


/* if, else if, else */

if (boolean1) {
    //statements 1
} else if (boolean2) {
    //statements 2
} else if (booleanN) {
    //statements N
} else {
    // statetments else
}

/* if else using object */

const elseIfObject = {
    "true": function () {
        //statements 1
    },
    "false": function () {
        //statements else
    }
};

elseIfObject[boolean1]();


/* if, else if, else using object 
useful pattern for constructing if else statement at runtime (dynamic if else)
can also be used for state machines*/


const ifElseIfObject = {
    "case1": function () {
        //statements for case 1
    },
    "case2": function () {
        //statements for case 2
    },
    "case3": function () {
        //statements for case 3 etc
    }
};

ifElseIfObject[stringValue]();


/* if else using switch 
here using return statement
can also use break, but things can get messy really fast when you
forget to break or, have for loops that use break inside ...
avoid switch if you can*/

const result = (function () {
    switch (variable) {

        case CASE1_VAR: { // use these to make block scoping possible
            const x = y;
            return x + 1;
        }

        case CASE2_VAR: {
            const x = z;
            return x + 2;
        }

        default: {
            return default_thing;
        }
    }
}());

/* Used by minifiers, DO NOT WRITE MANUALLY */


/* if else using ? : operator
result becomes a if input is truethy and b otherwise
this can be abused by putting a function call instead of a and b effectively
 making it a full if else statement equivalent */

const result = input ? a : b;

/* if else using || and && for assignement*/

const user = (users && users[0]) || null;
const variable = (condition && ifThing) || ElseThing;

/* if else using || and && with function*/

((boolean1 && functionIf()) || functionElse());

/* if else using || and && and function wrap*/

((boolean1 && (function () {/*statements1;*/ }())) ||/*else*/
    (function () {/*statements2;*/ }()))


