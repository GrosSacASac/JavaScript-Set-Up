# 6.0.0

 * Start Changelog
 * Use node protocol
 * Completed Readme
 * Better handling of badly formatted requests
 * Set reconnection time to 10000ms
 * Add possibility to change reconnection time with reconnectionTime
 * Replaced path option with general purpose condition
 * Use the following to keep using path

```js
const path = ...
const condition = (request) => {
    request.url === path;
};
```
