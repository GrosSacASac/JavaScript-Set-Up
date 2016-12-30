/*if else */

//if else

if (boolean1) {
    //statements 1
} else {
    //statements else
}


//if, else if, else

if (boolean1) {
    //statements 1
} else if (boolean2) {
    //statements 2
} else if (booleanN) {
    //statements N
} else {
    // statetments else
}

/*if else using object

*/

const elseIfObject = {
    "true": function () {
        //statements 1
    },
    "false": function () {
        //statements else
    }
};

elseIfObject[boolean1]();

//todo
//if, else if, else using object

//...

/*if else using || and && and function wrap*/

((boolean1 && (function () {/*statements1;*/}())) ||/*else*/
    (function () {/*statements2;*/}()))

/*if else using switch*/

/*if else using ? : operator
result becomes a if input is truethy and b otherwise
this can be abused by putting a function call instead of a and b effectively
 making it a full if else statement equivalent*/
const result = input ? a: b;


