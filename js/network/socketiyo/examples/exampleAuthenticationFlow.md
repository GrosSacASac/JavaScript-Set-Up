
1. create connection on the client
2. the connection is received on the server side
3. CONNECT event is emitted
4. On this event on the server side store the fact that the socket is initially unauthenticated

```
socketiYoServer.on(CONNECT, socket => {
    socket.authenthicated = false;
});
```

5. On the client send your authentication request on the client CONNECT event

```
socketiyoConnection.on(CONNECT, () => {
    socketiyoConnection.send({
        who: `Me`,
        proof: `password`
    }, `AUTHENTICATE`);
});
```

Usually the authentication includes the who, and the proof that the client is who it pretends to be.
The proof can be a password, a token, an object, a side channel message or any combination.

6. On the server validate, mark the socket as authenticated and send a confirmation back

```
socketiYoServer.on(`AUTHENTICATE`, async ({ socket, data }) => {
    const { who, proof } = data;
    const level = await authenticate(who, proof);
    
    if (!level) {
        // wrong data
        return;
    }

    socket.who = who;
    socket.level = level;
    socket.authenthicated = true;

    socketiYoServer.send(socket, { level }, `AUTHENTICATE_CONFIRMATION`);
});
```

For security reasons, do not store the proof on the socket, instead store its authorization level ('admin', 'user', etc)

7. Receive that update on the client side and update the interface accordingly

```
socketiyoConnection.on(`AUTHENTICATE_CONFIRMATION`, ({ level }) => {
    
});
```

After that, each event can be handled by the server by using simple if statements to check the who, level, and the is authenthicated variables.
