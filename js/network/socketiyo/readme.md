# socketiyo


Concept inspired by socket.io

What are the differences from socketiyo ?

Rooms and events are combined and called channels. These channels are hidden. When a client subscibes to an event, it will be listening on that channel with the same event name, that can only emit this event name.

Namespaces are handled outside of the library by creating more instances with different options.

The WebSocket server implementation is not provided, instead socketiyo expects a peer dependency to be injected at runtime.

The client is not served by default in the server. It has to be explicitly imported in the client code instead.

No fallback provided when WebSocket is not available. No background protocol upgrades.

No disconnection detection on the server yet.

Regular events and library events cannot be confused.

## Usage

### Install

#### client side

`npm i socketiyo-client`

#### server side

`npm i socketiyo`

...

### License

[CC0](./license.txt)