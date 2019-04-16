# Scaling above 1 server

**Draft**

There is a maximum amount of websocket connection any server can handle.

## Required infrastructure

 * Be able to create new socketiyo instances with different URLs
 * Store the state in a separate entity that is accessible by all instances
 * Serve instance communicate in full mesh topology (could use shared state above)
 * https://github.com/GrosSacASac/JavaScript-Set-Up/issues/10
 * https://github.com/GrosSacASac/JavaScript-Set-Up/issues/11
 * https://github.com/GrosSacASac/JavaScript-Set-Up/issues/12

## Create as needed strategy

### High load event

The high load event is emitted when the first limit is reached.

### Over load event

The over load event is emitted when the maximum limit is reached.

### Available again event

Should trigger when the server is available again to receive new connections. To avoid triggering this event + the high load event on every connection/disconnection, make the limit signifcantly lower than the high load event.

### Flow

 * Too many clients connect to the server instance
 * The High load event is emitted
    * create a new server instance that has an URL
    * or use an existing instance that is below a certain threshold
    * send a message to the front end asset server with the URL
 * When the front end asset server receives the message
    * Serve the clients with the new URL as the websocket endpoint
 * New Clients receive HTML+JS with the new URL
    * When they connect with `createConnection` they use the dynamic URL
    * After some time go back to the first step

### Available Again flow

 * The server instance is overloaded and emits the high load (see flow above)
 * After some time no new connection arrive
 * Clients disconnect regularly
 * The Available again limit is reached, the associated event is emitted
 * all other server instances know that the server is available


## Random distribution strategy

The client side receives a list of websocket endpoints and connects to one randomly chosen.

TODO add details about this strategy