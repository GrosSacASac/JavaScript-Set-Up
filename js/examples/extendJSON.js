/*how to extend JSON ?*/
"use strict";



/*also parses functions, some assumptions are made:
 functions may have different context,
 regular strings never start with  "function (",
 trusted original object, because eval is used*/
 
const JSONX = {};



JSONX.parse = function (JSONXString) {
    return JSON.parse(JSONXString, function(key, value) {
        //this is a safe check as JSON parse does not produce string wrapped into objects
        if (typeof value === "string" && value.startsWith("function (")) {
            return eval(`(${value})`);
        }
        
        return value; // no special extra parsing
    });
};

JSONX.stringify = function (objectToStringify) {
    return JSON.stringify(objectToStringify, function replacer(key, value) {
        if (typeof value === "function") {
            return value.toString();
        }
        
        return value;
    });
};

//trial
const originalObject = {
    "a": 5,
    "cubic": function (x) {
        return x * x * x;
    }
};


const stringifiedObject = JSONX.stringify(originalObject);

const newObject = JSONX.parse(stringifiedObject);

console.log(originalObject, newObject);

