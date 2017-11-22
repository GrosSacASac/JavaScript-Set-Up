// Set is a type introduced in ES2015

// Conversions

const listFromSet = function (aSet) {
    const result = [];
    let item;
    for (item of aSet) {
        result.push(item);
    }
    return result;
};

const listFromSet2 = function (aSet) {
    return Array.from(aSet);
};

const listFromSet3 = Array.from;

let s = new Set();

s.add(5);
s.add(6);
s.add(7);

let l = listFromSet(s);
let l2 =  listFromSet2(s);
let l3 =  listFromSet3(s);

console.log(s, l, l2, l3);
