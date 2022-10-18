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

const sockets = []; //[chrome,firefox,naverwhale];

webSoecketServer.on('connection', (socket) => {
    sockets.push(socket);
    console.log('connect to browser');
    socket.on('message', (message) => {
        sockets.forEach(socket => socket.send(message));
    });
    socket.on('close', () => {
        console.log('disconnected to client')
    })
    socket.send('Hello Client!');
});

const handleListener = () => console.log(`server listening on http://localhost:${PORT_NUM}`);
server.listen(PORT_NUM, handleListener);