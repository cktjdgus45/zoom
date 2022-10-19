import express from 'express';
import http from 'http';
import path from 'path';
import { readFileSync } from 'fs';
import WebSocket, { WebSocketServer } from 'ws';


const PORT_NUM = 3000;

const app = express();
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");

app.use("/public", express.static(__dirname + "/src/public/"));

app.get("/", (req, res, next) => {
    res.render("home");
})

const server = http.createServer(app);
const webSoecketServer = new WebSocketServer({ server });

const sockets = []; //[chrome,firefox,naverwhale,brave];

webSoecketServer.on('connection', (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    socket.on('message', (messageFromClient) => {
        const { type, payload } = JSON.parse(messageFromClient);
        console.log(type, payload);
        if (type === "new_message") {
            sockets.forEach(socket => socket.send(`${socket.nickname}: ${payload}`));
        }
        if (type === "nickname") {
            socket["nickname"] = payload.trim() === "" ? "Anonymous" : payload;
        }
    });
    socket.on('close', () => {
    })
    socket.send('Hello Client!');
});

const handleListener = () => console.log(`server listening on http://localhost:${PORT_NUM}`);
server.listen(PORT_NUM, handleListener);