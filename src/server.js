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
webSoecketServer.on('connection', (socket) => {
    socket.on('message', (data) => {
        console.log('received: %s', data);
    });
    socket.on('close', () => {
        console.log('disconnected to client')
    })
    socket.send('Hello Client!');
});

const handleListener = () => console.log(`server listening on http://localhost:${PORT_NUM}`);
server.listen(PORT_NUM, handleListener);