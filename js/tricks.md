# JS tricks

`Object.assign` is useful on arrays.

```
const initialScores = [0, 0, 0];
// player a, player b, total games
const scores = [5, 2, 7];

// reset scores
Object.assign(scores, initialScores);
```

`{}` can be used to create local scopes anywhere

```
const minMax = function (numbers) {
    const results = [];
    // variables localResult does not clash,
    // independent blocks are used
    {
        const localResult = Math.min(...numbers);
        results.push(localResult);
    }

    {
        const localResult = Math.max(...numbers);
        results.push(localResult);
    }
    return results;
};

```


Array destructuring syntax can be used to swap variables;

```
let a = 5;
let b = 2;
[a, b] = [b, a];
```


Remove duplicates from an array

```
let a = [5, 4, 4, 4, 3];
a = [...(new Set(a))];
```

Object.seal and Object.freeze to ensure that an external object does not exceed an Interface

```
const requestInterface = {
    event: undefined,
    startDate: undefined,
    endDate: undefined
};

const handleRequest = function (request) {
    const minimalRequest = Object.seal(Object.assign({}, requestInterface));
    Object.assign(minimalRequest, request);
    processRequest(minimalRequest);
};

const processRequest = function (request) {
    console.log(request);
};

// this will throw
handleRequest({
    event: undefined,
    startDate: undefined,
    endDate: undefined,
    tooMuch: "data",
    leadsTo: "leaks"
});
```

default assignement syntax to log for required parameters

```
const required = function () {
    throw `required parameter missing`;
};

const vector3Interface = [0, 0, 0];

const slowVector3 = function (vector3 = required()) {
    return vector3.map(u => u / 2);
};

slowVector3() --> Error: required parameter missing
```

It works really well with destructuring too


```
const required = function (message = "") {
    throw `required parameter ${message} missing`;
};

const vector3Interface = [0, 0, 0];

const slowVector3 = function ([x = required("x"), y = required("y"), z = required("z")] = required("v3")) {
    return [x / 2, y / 2, z /2];
};

slowVector3([6, 8]); --> Error: required parameter z missing 
```

