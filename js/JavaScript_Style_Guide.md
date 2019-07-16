# JavaScript Style Guide

## Priorities

 1. Readability
 2. Cristal clear way to add and substract functionality
 3. Minimal vocabulary
 4. Modern

## Outline

1. features to use
2. features to avoid
3. features to never use


## 1. features to use

## general

Use trailing commas.

Prefer `const` over `let`, no `var`.

Explicit type conversion with the functions `String`, `Boolean`, `Number`, `Array.from`, `Object.fromEntries`.

`return`, `throw` as early as possible to avoid huge indentation levels.

Make every line of code independent if possible, do not use chain variable assignements.

## function

Use an expression because:

 * it works as assignment
 * as parameter for another function
 * as IIFE
 * compatible with arrow and original function syntax
 * ability to mark as const
 * easy to alias
 * easy to decorate
 * no hoisting

 Ideally less than 4 parameters. If more consider using an objects and destructuring.
 Always use explicit return for arrow functions.

 ```js
 const x = function (a, b) {
    return a - b;
 };

 const y = (a, b) => {
     return a * b;
 };
 ```

## array, object, import, export

Use multiple lines for 3 or more items.

## array

`.length = 0` to reset it.

`[]` to create a new array.

`.push()` to append.


```js
const array = [
    4,
    5,
    6,
];
```

Use `map`, `forEach` and other array methods to loop over an array.
```Array.isArray``` for type checking.

## object

`object[key] = value;` to add a key value pair.

`delete object[key]` to remove a key value pair.

`{}` to create a new object.

.
Use the shorthand when possible , computed properties

```js
const b = 7;
const c = `key`;
const object = [
    a: 5,
    [c]: 9,
    b,
];
```

Use `Object.keys`, `Object.values`, `Object.entries` to convert it to an array, then use array methods to loop over an object. ```typeof x === `object` && x !== null``` for type checking

## strings

Use backtick ``` ` ``` as they always work. `'` and `"` can be included directly. Concatenation is done via  ```${x}```. Adding line breaks just works. ```\n``` can also be used. There is no need to switch the delimiter.

```js
const s = `string`;
const s2 = `Tom says: "That's my ${s}"`;
```

```typeof x === `string` ``` for type checking 

## numbers

Prefer `Number.isFinite` over `isNaN`. `Number.isFinite` can also be used for type checking.

## date

Use numbers to store dates. Use the `Date` built-in to display them.

Store the current time.

```js
const time = Date.now();
```

To display the date.

```js
const date = new Date();
date.setTime(time);

d.toLocaleString();
d.toLocaleTimeString();
d.toLocaleDateString();
// and other toString variants
```

## if else

Always use multiline brackets.

```
if (condition) {

}
```

```
if (condition) {
    
} else {

}
```

```
if (condition) {
    
} else if (otherCondition) {

} else {

}
```

## import export

Put them at the top of the file as they will be executed first. Put exports before imports as they are executed before. Use named exports. Do not inline named exports in the middle of the file to make it obvious what is exported by reading the first line.

```js
export { y };
import { x } from "./x.js";


const y = 5;
```

## 2. features to avoid

## `this`

Avoid `this`. And assoiciated `bind`, `call`, `apply`, `class`, `prototype`, `super`, `new`, `extends`, `Object.create`, `Object.setPrototypeOf`, `__proto__`. Any function can return an object, any function can take an object as first argument and operate on it.  Every function can compose or combine results of other functions. `bind` can be still be useful for currying with undefined as first value.

## `apply`

Prefer array spread syntax.

## `class`

Prefer regular objects and functions. These can be exported from the same file and one can still use Object-oriented patterns without the `class` keyword.

## ternary operator

Prefer `if else`,  as they can be extended and are cleaner.

## switch statements 

Prefer `if else`. Forget about `switch`, `case`, `break`.

## conditional assignement

Avoid

```js
const x = y || z;
const r = z && u || w;
```

Prefer `if else`

## generators

Use a function that returns a function instead with closures.

## chained method calls

Keep lines independent

## comma operator

## for of, for in, for () loops



## global variables

Prefer explicit exported variables.

## Modifications of built-ins

Prefer exporting new variables with different names.

## Export objects with multiple variables

Prefer exporting variables individually via named exports. Three shake friendlier and less runtime overhead.

## default exports

No clear way to add or substract functionality. Prefer default exports.

## getters and setters

Prefer explicit functions.

## Implicit type conversion

## `arguments`

Do not use the special `arguments`, use rest arguments instead

## Soft equal

Avoid  `==` and  `!=`, prefer `===` and `!==`

## Automatic semicolon insertion

## try catch over everything

Use `try catch` on individual statements that are expected to fail

## disable the linter on individual files, lines

## 3. features to never use

## with

Use object destructuring instead.


## About


### Inspiration

APIs: https://www.youtube.com/watch?v=gweY3L0YA1Y
