# JavaScript Red Style Guide

<img src="https://raw.githubusercontent.com/GrosSacASac/JavaScript-Set-Up/master/js/red-javascript-style-guide/images/red.jpg" alt="red">

_red is life passion fire_

## Priorities

 1. Readability
 2. Crystal clear way to add and subtract functionality
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

Make every line of code independent if possible, do not use chain variable assignments.

### function

Use an expression because:

 * it works as assignment
 * as parameter for another function
 * as IIFE
 * compatible with arrow and original function syntax
 * ability to mark as constant
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

### object life-cycle

Declare all fields as soon as possible even if they don't have a value yet, put the creator/constructor function first. A seal on the object returned by the constructor (`return Object.seal(hero)`) should not throw any error.

```js
const createHero = ({ name }) => {
    const hero = {
        name,
        hitPoints: 100,
        location: [0, 0],
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

#### Export and import as a namespace

Alternatively omit "Hero" in function names to avoid renaming.
```js
export { 
    createHero as create,
    moveHero as move,
    teleportHero as teleport,
};
```

```js
import * as Hero from "./hero.js";


const hero = Hero.create({ name: `Superjhemp` });
Hero.move(hero, [5, 20]);
Hero.teleport(hero, [100, 100]);
```



### array, object, import, export

Use multiple lines for 4 or more items and consider it at 3 items.

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
`Array.isArray` for type checking.

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

Use `Object.keys`, `Object.values`, `Object.entries` to convert it to an array, then use array methods to loop over an object. ```typeof x === `object` && x !== null``` for type checking.

### strings

Use backtick ``` ` ``` as they always work. `'` and `"` can be included directly. Concatenation is done via  ```${x}```. Adding line breaks just works. ```\n``` can also be used. There is no need to switch the delimiter.

```js
const s = `string`;
const s2 = `Tom says: "That's my ${s}"`;
```

```typeof x === `string` ``` for type checking .

### numbers

Prefer `Number.isFinite` over `isNaN`. `Number.isFinite` can also be used for type checking. It returns false if the number is `NaN`, `Infinity`, `-Infinity` or another type. ```typeof x === `number` ``` will return true if `x` is `NaN`, `Infinity`, `-Infinity` as well.

### symbols


```js
const mySymbol = Symbol();
const yourSymbol = Symbol(`A meaningful description`);
yourSymbol.description;
```

Do not use `Symbol.for` because they are disguised globals. ``` typeof mySymbol === `symbol` ``` for type checking.

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

date.toLocaleString();
date.toLocaleTimeString();
date.toLocaleDateString();
// and other toString variants
```

### sets

Yes

```js
new Set();
```

#### When to use sets over arrays

 * No duplicates are wanted
 * The order is irrelevant


### maps

Yes

```js
new Map();
```

#### When to use maps over objects

In the following situations:

 * Keys are something else than string or symbol
 * Continuous adding and removal of key-value pairs
 * Keys are unknown or can be anything
 
### absence of value

Use `undefined`, avoid `null`. `undefined` is the default that is already used by the language, for example: destructuring when missing, default return value, unassigned variable etc.

### Booleans

`true` or `false`, use `Boolean` function to force cast to a boolean. Do not use `!!` to cast to a boolean. Leverage truthy values in `if` and `while`.

### promises

Prefer promises over callbacks for one-time futures. Use `async`, `await` , `Promise.all`.

### if else

Always use multi-line brackets.

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
import * as z from "./z.js";
import FastAverageColor from "fast-average-color/dist/index.esm.js";

const y = 5;
```

### Limit variable reach

Historically it has been done with an immediately invoked function expression, now that let and const are available and block scoped use a simple block. With an iife:

```js
// do not expose i
let nextSquare;
(function () {
    let i = 0;
    nextSquare = function () {
        i += 1;
        return i ** 2;
    };
}());
```

With a block:

```js
let nextSquare;
{
    let i = 0;
    nextSquare = function () {
        i += 1;
        return i ** 2;
    };
}
```

### global built-ins

Use directly.

```js
setTimeout(() => {

}, 1000);
```

avoid 

```js
window.setTimeout(() => {

}, 1000);
```


-------------------


## 2. Features to avoid

### `this` and `class`

[Read Why disallow the class keyword](https://github.com/GrosSacASac/JavaScript-Set-Up/blob/master/js/red-javascript-style-guide/why-disallow-class.md)

Avoid `this`. And associated `bind`, `call`, `apply`, `class`, `prototype`, `super`, `new`, `extends`, `Object.create`, `Object.setPrototypeOf`, `Object.getPrototypeOf`, `__proto__`, `instanceof`, `typeof`, `.prototype.isPrototypeOf`.

Any function can return an object, any function can take an object as first argument and operate on it.  Every function can compose or combine results of other functions.

Prefer regular objects and functions over `class`. These can be exported from the same file and one can still use Object-oriented patterns without the `class` keyword.

`bind` can still be useful for currying with undefined as first value.

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


### regular expressions

Avoid when possible. Regular expression is a powerful language that overlaps with JS constructs. Often a single line can obscure recursive and complex instructions. The tooling to debug and assess performance of regexs are lower than JS. 

Avoid the constructor syntax. Use named groups. 

```js
let r = /[a-z]+/;
```

#### Alternatives

##### Use regular objects

Regex are sometimes used to extract information out of a big string. Consider using an object instead that can be extracted with JSON for example.

##### Raw String 

 * `String.prototype.includes`
 * `String.prototype.indexOf`
 * `String.prototype.replace`
 * `String.prototype.endsWith`
 * `String.prototype.startsWith`


### ternary operator

Prefer `if else`,  as they can be extended and are cleaner.

### switch case break 

Prefer `if else`.

### conditional assignment

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

Prefer array built-ins to iterate.

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

No clear way to add or subtract functionality. Prefer named exports.

### Meta-programming and Proxy

Avoid whenever possible. Avoid the use of `Proxy`, `Object.defineProperty`, `Function.name` and  `Function.length`.

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

Avoid relying on asi to be consistent and have less edge cases to remember.

### try catch over everything

Use `try catch` on individual statements that are expected to fail for code clarity it makes it obvious which one is expected to fail. Generally avoid `try catch` entirely if possible. Validate input as early as possible to avoid potential error management in the middle of the function body.

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
The increment amount can be something else than 1. It can be any variable.
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

### void operator

Don't use the void operator, use a dedicated minifier instead.



--------------------

## Details

### naming

Use semantic long descriptive names for variables. Do not use names that are already used by built-in globals or [special keywords](https://github.com/rollup/rollup/blob/master/src/utils/reservedNames.ts).

Camel case for regular variables and file names. No spaces.

Optionally Pascal case for creator/constructors.

Optionally MACRO_CASE (all caps with underscores) for top level constants that do not change across versions and runs.

Package/module names and script names with Kebab case (lowercase with dashes). No dots.

Default imports use the same letters as the package name.

#### Examples

`majo-ubjson` as package name

`majoUbjson.js` entry file (not index.js)

`bundle`, `minify-html` as script names


```js
// ALWAYS the same
const { PI } = Math;
const HALF_PI = PI / 2;

// regular variables that can be changed
const radius = 1;
const volumeSphere = (4 / 3) * PI * radius ** 3;

// constructor
const BookStore = class {

};

// creator Pacal (CreateHero) or camel case (createHero)
const createHero = function () {
    const hero = {};
    return hero;
};

// No !
// confusing 
const await = 2;
// overshadows built-in
const Date = { year: 2019 };
```


### indentation

Indent with 4 spaces, or 1 tab.

### spacing

Start with prettier.

### Extensions

If any non standard features are used, use should be documented. If any features are not in the standard track pipeline, the file extension should reflect that.

Prefer to avoid use of features that have not reached stage 4.

### Empty if else bodies

Yes when it helps document the code, for example by acknowledging a given situation.

### magic numbers

Use constants at the top of the scope.

### package.json (when used)

### Order by what you want to see the most.

1. Name, version, description, license, author, homepage (What is it ?)
2. type, main, module, browser, exports, bin (What is the entry file ?)
3. scripts (What commands  are available ?)
4. dependencies, optionalDependencies, peerDependencies devDependencies (What does it use ?)
5. configs, engines, os, cpu (How is it configured ?)
6. files, repository, keywords, private, publishConfig (Meta, publishing, distribution)

Avoid peerDependencies because they create more problems than they solve, instead specify them in the documentation.

### Minimal example

```json
{
  "name": "utilsac-example",
  "version": "15.0.0",
  "description": "Utility functions",
  "license": "CC0-1.0",
  "type": "module",
  "main": "utility.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/GrosSacASac/utilsac-example.git"
  }
}
```

---------------------

## About

### Lint set-up

Install eslint and eslint-red rules

```
npm i -D eslint eslint-config-red
```

Inside package.json

```json
"eslintConfig": {
    "extends": ["red"],
    "parserOptions": {
      "ecmaVersion": 2021,
      "sourceType": "module",
      "ecmaFeatures": {}
    },
    "env": {
      "es2021": true,  
      "browser": true,
      "node": true,
      "serviceworker": true,
      "worker": true
    },
    "rules": {}
}
```

Below es2021, remove unused environment.

If code is meant for other environments other than browser, [add them to "env"](https://eslint.org/docs/user-guide/configuring#specifying-environments)

Inside package.json > scripts

```
    "lint-fix": "eslint --ignore-path .gitignore --fix source",
    "lint": "eslint --ignore-path .gitignore source",
```

where source is the folder containing all the files to lint.

### Inspiration

 - [APIs (video)](https://www.youtube.com/watch?v=gweY3L0YA1Y)
 - [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
 - [Avoid conditions](https://blog.sapegin.me/all/avoid-conditions/)
 - [Return asap](https://margaine.com/2014/06/20/return-asap.html)
 - [Tabs instead of spaces](https://dev.to/alexandersandberg/why-we-should-default-to-tabs-instead-of-spaces-for-an-accessible-first-environment-101f)
 - [JSLint](https://jslint.com/help.html)

### Contributors

- GrosSacASacs
- fschoenfeldt

### License

Public Domain

### See also

[CSS Style Guide](https://github.com/GrosSacASac/JavaScript-Set-Up/blob/master/css/css_style_guide.md)
