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


## Inspiration

APIs: https://www.youtube.com/watch?v=gweY3L0YA1Y


## 1. features to use

## general

Use trailing commas 

Prefer `const` over `let`, no `var`

## function

Use an expression because:

 * it works as assignment
 * as parameter for another function
 * as IIFE
 * compatible with arrow and original function syntax
 * ability to mark as const
 * easy to alias
 * easy to decorate

## array and object

Use multiple lines for 3 or more items

## array

`.length = 0` to reset it

`[]` to create a new array

`.push()` to append


```
const array = [
    4,
    5,
    6,
];
```

## object

`object[key] = value;` to add a key value pair

`delete object[key]` to remove a key value pair

`{}` to create a new object


Use the shorthand when possible , computed properties

```
const b = 7;
const c = `key`;
const object = [
    a: 5,
    [c]: 9,
    b,
];
```

## date

Use numbers to store dates. Use the `Date` built-in to display them

Store the current time

```js
const time = Date.now()
```

To display the date

```js
const date = new Date();
date.setTime(time);

d.toLocaleString();
d.toLocaleTimeString();
d.toLocaleDateString();
// and other toString variants
```

## if else

Always use multiline brackets 

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


## 2. features to avoid

## `this`

Avoid `this`. And assoiciated `bind`, `call`, `apply`, `class`, `prototype`, `super`, `new`, `extends`, `Object.create`, `Object.setPrototypeOf`. Any function can return an object, any function can take an object as first argument and operate on it.  Every function can compose or combine results of other functions. `bind` can be still be useful for currying with undefined as first value.

## `apply`

Prefer array spread syntax.

## `class`

Prefer regular objects and functions. These can be exported from the same file and one can still use Object-oriented patterns without the `class` keyword.

## ternary operator

Prefer `if else`,  as they can be extended and are cleaner.

## conditional assignement

Avoid

```js
const x = y || z;
const r = z && u || w;
```

Prefer `if else`

## global variables

Prefer explicit exported variables

## Modifications of built-ins

Prefer exporting new variables with different names

## Export objects with multiple variables

Prefer exporting variables individually via named exports. Three shake friendlier and less runtime overhead

## default exports

No clear way to add or substract functionality. Prefer default exports

## getters and setters

Prefer explicit functions


## 3. features to never use

## with

Use object destructuring instead

