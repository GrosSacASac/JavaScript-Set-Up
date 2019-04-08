# JavaScript Style Guide

## Philosophy

### 1 Cristal clear way to add and substract
### 2 Readability
### 3 SOLID
### 4 Obviously correct code


## Inspiration

APIs: https://www.youtube.com/watch?v=gweY3L0YA1Y

## general

Use trailing commas <small>#1</small>

Prefer `const` over `let`, no `var` <small>#4</small>

## function

Use an expression because:

 * it works as assignment <small>#1</small>
 * as parameter for another function
 * as IIFE
 * compatible with arrow and original function syntax <small>#2</small>
 * ability to mark as const <small>#4</small>

## array

`.length = 0` to reset it

`[]` to create a new array

`.push()` to append

Use multiple lines <small>#1</small> <small>#2</small>

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


Use multiple lines <small>#1</small> <small>#2</small>, the shorthand when possible <small>#2</small>, computed properties to inline

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

`const time = Date.now()` to get the current time

```js
const d = new Date();
d.setTime(time);
```

To display the date

```js
d.toLocaleString();
d.toLocaleTimeString();
d.toLocaleDateString();
```

## if else

Always use multiline brackets #1 <small>#2</small>

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