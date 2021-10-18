/* Array */
/*How to create an empty Array ?*/
let array;

// same 
array = [];
array = Array.of();
array = Array(); // avoid because it is unsafe

// set
array[5] = "Hi";

// get
const seventhItem = array[6];

// get the length
const length = array.length;

// add 1 thing at the end 
array.push("something");

// add multiple things at the end 
array.push(4, 88, 99);

// add an array at the end (inlines the array)
array.push(...[4, 88, 99]);

// add at the begining
array.unshift("JS");

// remove the last thing
array.pop();
array.splice(-1); // alternative
array.length += -1; // alternative

// remove the last thing and store it
const removedLastPart = array.pop();
const removedLastPart2 = (array.splice(-1))[0]; // alternative
// alternative
const newLength = array.length - 1;
const removedLastPart3 = array[newLength]; 
array.length = newLength;

// remove the first thing and store it
const removedFirstPart = array.shift();

// remove at a specific position
const specificPosition = 5; // remove the 6th element in the array
array.splice(specificPosition, 1);

// remove a specific item once, if the item is not there it removes the last 
const itemToBeRemoved = "removeMe";
const specificItemPosition = array.indexOf(itemToBeRemoved);
array.splice(specificItemPosition, 1);


// remove a specific item once, safe
const itemToBeRemoved = "removeMe";
const specificItemPosition = array.indexOf(itemToBeRemoved);
if (specificItemPosition !== -1) {
    array.splice(specificItemPosition, 1);
}

// replace an item, safe
let array = [1, 2, 3, "removeMe", 10];
const itemToBeRemoved = "removeMe";
const itemToBeInserted = "I am new";
const index = array.indexOf(itemToBeRemoved);
if (index !== -1) {
    array.splice(index, 1, itemToBeInserted);
}

// remove duplicates in another array
const a = [0, 1];
const b = [1, 2];
// a and b can be the same
const c = [...new Set([...a, ...b])]; // [0, 1, 2]


// concat 2 arrays
const arrayA = [1, 2, 3];
const arrayB = [4, 5, 6];
const array_AandB = arrayA.concat(arrayB);
// alterantive 
const array_AandB = [...arrayA, ...arrayB];

