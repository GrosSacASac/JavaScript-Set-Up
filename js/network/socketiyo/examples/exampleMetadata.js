
let i = 0;

socketiYoServer.on(CONNECT, socket => {
    socket.connectTime = Date.now();
    socket.localId = String(i);
    i += 1;
});
