/*how to extend JSON ? by example

Atomic WARNING: do not do this at home !*/
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
            return eval(`(${value})`); // could use new Function ?
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

console.log(originalObject, newObject);//compare by inspecting in console

//addtional tips: don't use JSONP! it violates the principle : don't trust what you don't control
