# JavaScript Style Guide

## Priorities

 1. Readability
 2. Crystal clear way to add and substract functionality
 3. Minimal vocabulary
 4. Modern

## Outline

1. Features to use
2. Features to avoid
3. Features to never use
4. Details

------------------------

## 1. Features to use

### general

Use trailing commas.

Prefer `const` over `let`, no `var`.

Explicit type conversion with the functions `String`, `Boolean`, `Number`, `Array.from`, `Object.fromEntries`.

`return`, `throw` as early as possible to avoid huge indentation levels.

Make every line of code independent if possible, do not use chain variable assignements.

### function

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

### object lifecycle

Declare all fields as soon as possible even if they don't have a value yet, put the creator/constructor function first. A seal on the object returned by the constructor (`return Object.seal(hero)`) should not throw any error.

```js
const createHero = ({ name }) => {
    const hero = {
        name,
        hitPoints: 100,
        location: [0, 0]
        favouriteAttack: undefined,
    };
    
    return hero;
};

const moveHero = (hero, [x, y]) => {
    const [pastX, pastY] = hero.location;
    hero.location = [pastX + x, pastY + y];
};

const teleportHero = (hero, location) => {
    hero.location = location;
};
```



### array, object, import, export

Use multiple lines for 3 or more items.

### array

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

### object

`object[key] = value;` to add a key value pair.

`delete object[key]` to remove a key value pair.

`{}` to create a new object.

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

### strings

Use backtick ``` ` ``` as they always work. `'` and `"` can be included directly. Concatenation is done via  ```${x}```. Adding line breaks just works. ```\n``` can also be used. There is no need to switch the delimiter.

```js
const s = `string`;
const s2 = `Tom says: "That's my ${s}"`;
```

```typeof x === `string` ``` for type checking 

### numbers

Prefer `Number.isFinite` over `isNaN`. `Number.isFinite` can also be used for type checking. It returns false if the number is `NaN`, `Infinity`, `-Infinity` or another type.

### date

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

### if else

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

### import export

Put them at the top of the file as they will be executed first. Put exports before imports as they are executed before. Use named exports. Do not inline named exports in the middle of the file to make it obvious what is exported by reading the first line.

```js
export { y };
import { x } from "./x.js";


const y = 5;
```

### promises

Prefer promises over callbacks for one-time futures.

-------------------


## 2. Features to avoid

### `this`

Avoid `this`. And assoiciated `bind`, `call`, `apply`, `class`, `prototype`, `super`, `new`, `extends`, `Object.create`, `Object.setPrototypeOf`, `__proto__`. Any function can return an object, any function can take an object as first argument and operate on it.  Every function can compose or combine results of other functions. `bind` can be still be useful for currying with undefined as first value.

### `apply`

Prefer array spread syntax.

```js
const numbers = [4, 5];
const max = Math.max.apply(undefined, numbers);
```

```js
const numbers = [4, 5];
const max = Math.max(...numbers);
```

### `class`

Prefer regular objects and functions. These can be exported from the same file and one can still use Object-oriented patterns without the `class` keyword.

### ternary operator

Prefer `if else`,  as they can be extended and are cleaner.

### switch case break 

Prefer `if else`.

### conditional assignement

Avoid

```js
const x = y || z;
const r = z && u || w;
```

Prefer `if else`.

### chained method calls

Keep lines independent.

### comma operator

The comma operator is well known to write one-liners and hurts readability. Put each instruction on individual lines.

### for of, for in, for () loops

Prefer array builtins for loops.

### Export objects with multiple variables

Prefer exporting variables individually via named exports. Three shake friendlier and less runtime overhead.

Avoid

```js
export { constants };

const constants = {
    X: 1,
    Y: 2,
};
```

Prefer

```js
export { X, Y };

const X = 1;
const Y = 2;
```


### default exports

No clear way to add or substract functionality. Prefer named exports.

### Meta-programming and Proxy

Avoid whenever possible.

### getters and setters

For setters that have additional functionality prefer explicit functions. Otherwise use public members.

### Implicit type conversion

Prefer explicit type conversion

```js
const x = `1`;
// const y = +x;
const y = Number(x);
```

```js
const y = 1;
//const x = "" + y;
const x = String(x);
```


### arguments

Do not use the special `arguments`, use rest arguments instead.

### Soft equal

Avoid `==` and `!=`, prefer `===` and `!==`.

### Automatic semicolon insertion

To be consistent and have less egde cases to remember.

### try catch over everything

Use `try catch` on individual statements that are expected to fail. Generally avoid `try catch` entirely if possible.

### try catch finally

Avoid finally, in most cases, putting the statements after try catch has the same effect.

### generators, iterators

Avoid generators and associated `yield` keyword. Prefer functions that return a function with a closure.

### side effect inside if

Avoid any side effect inside the condition of an `if`. Same for `while` and `for`.

### disable the linter on individual files, lines

Be consistent.

### multi level destructuring

Avoid,

```js
const { body: { className } } = document;
```

prefer 1 line per level.

```js
const { body } = document;
const { className } = body;
```

### unary operators ++ --

Avoid those. Prefer `+=` and `-=`.
There is no need to remember the difference between `--a` and `a--`.
The incremt value can be something else than 1. It can be any variable.
It is consistent with other operators such as /= , *= , **= , %= etc

```js
let a = 1;
a += 1;
a /= 2;
```

-------------------

## 3. Features to never use

### global variables

Prefer explicit exported variables. With the exception of polyfills.

### Modifications of built-ins

Prefer exporting new variables with different names.

### with

Use object destructuring instead.

### non-strict mode

Strict mode throws error when doing things like assigning to `undefined` and will prevent mistakes. Strict mode is always enabled when using `import/export`.

### new Boolean, new String, new Array, new Object

These have no real purpose other than introduce subtle bugs. Use `Boolean`, `String` and array literal `[]` instead. `new Object()` is harmless but use the object literal shorthand `{}` for consistency.



--------------------

## Details

### naming

Use semantic long descriptive names for variables, etc.

Camel case for regular variables and file names. No spaces.

Optionally Pascal case for creator/constructors.

Optionally all caps with underscores for top level constants that do not change across versions and runs.

Package/module names and script names with lowercase with dashes. No dots.

### indentation

Indent with 4 spaces, or 1 tab.

### spacing

TODO



---------------------

## About

### Lint set-up

TODO HELP WANTED


### Inspiration

 - [APIs (video)](https://www.youtube.com/watch?v=gweY3L0YA1Y)
 - [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
 - [Avoid conditions](https://blog.sapegin.me/all/avoid-conditions/)
 - [Return asap](https://margaine.com/2014/06/20/return-asap.html)
  - [tabs instead of spaces](https://dev.to/alexandersandberg/why-we-should-default-to-tabs-instead-of-spaces-for-an-accessible-first-environment-101f)

### Contributors

- GrosSacASacs
- fschoenfeldt

### License

Public Domain