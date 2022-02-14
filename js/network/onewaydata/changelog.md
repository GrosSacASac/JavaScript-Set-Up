# 6.1.0

 * data must be a string
 * handle multi line messages

# 6.0.0

 * Start Changelog
 * Use node protocol
 * Completed Readme
 * Better handling of badly formatted requests
 * Set reconnection time to 10000ms
 * Add possibility to change reconnection time with reconnectionTimeh
 * Removed a weird condition
 * Simplify code with optional chaining
 * Fix reconnection
 * Replaced path option with general purpose condition

Use the following to keep using path:

```js
const condition = (request) => {
    return request.url === `/sse`;
};
```
