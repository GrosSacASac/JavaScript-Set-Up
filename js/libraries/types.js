//Type casting and conversion

const listFromSet = function (aSet) {
    let result = [];
    for (let item of aSet) {
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
