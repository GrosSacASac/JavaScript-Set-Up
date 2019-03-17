const connection = new WebSocket(`ws://localhost:8080/`);

connection.addEventListener(`message`, (x) => {
    console.log(x.data);
});