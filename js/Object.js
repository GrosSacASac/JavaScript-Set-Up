/* Knowledge about Object */
"use strict";

/* How to create an empty Object ? */
let anObject;

// same
anObject = Object.create(Object);
anObject = Object();
anObject = {};

// without prototype
anObject = Object.create(null);

// assign simple
anObject["key"] = "value";

// assign multiple
Object.assing(anObject, {
    "key1": "value1",
    "key2": "value2",
});

// get a specific value
anObject["key"];

// get Length
Object.keys(anObject).length;
Object.values(anObject).length;
Object.entries(anObject).length;

// iterate over
// keys only
Object.keys(anObject).forEach(function (key) {

});

// values only
Object.values(anObject).forEach(function (value) {

});

// keys and values
Object.entries(anObject).forEach(function ([key, value]) {

});

// has
anObject.hasOwnProperty("key");

// has safe, works even when anObject has a key "hasOwnProperty"
Object.prototype.hasOwnProperty.call(anObject, "key");
