async function handleConn(conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const e of httpConn) {
      e.respondWith(handle(e.request));
    }
}
  
function handle(req) {
    if (req.headers.get("upgrade") != "websocket") {
      return new Response("not trying to upgrade as websocket.");
    }
    console.log(req)
    const { websocket, response } = Deno.upgradeWebSocket(req);
    // webSocketServer.dispatchEvent(new Event("connection", websocket))
    // websocket.onopen = () => console.log("socket opened");
    // websocket.onmessage = (e) => {
    //   console.log("socket message:", e.data);
    //   websocket.send(new Date().toString());
    // };
    // websocket.onerror = (e) => console.log("socket errored:", e.message);
    // websocket.onclose = () => console.log("socket closed");
    return response;
}
  
const listener = Deno.listen({ port: 8080 });
console.log("listening on http://localhost:8080");
for await (const conn of listener) {
    handleConn(conn);
}



