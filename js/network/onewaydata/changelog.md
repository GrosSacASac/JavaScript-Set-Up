# 6.3.0

 * connection condition also has access to response

# 6.2.0

 * add .sendWithCondition(messageObject, condition)

# 6.1.0

 * data must be a string
 * handle multi line messages

# 6.0.0

 * Start Changelog
 * Better handling of badly formatted requests
 * Set reconnection time to 10000ms
 * Add possibility to change reconnection time with reconnectionTime
 * Simplify code with optional chaining
 * Fix reconnection
 * Replaced path option with general purpose condition

Use the following to keep using path:

```js
const condition = (request, response) => {
    return request.url === `/sse`;
};
```
