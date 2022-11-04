import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

const PORT_NUM = 3000;

const app = express();
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");

app.use("/public", express.static(__dirname + "/src/public/"));

app.get("/", (req, res, next) => {
    res.render("home");
})

const httpServer = http.createServer(app);
const webSocketServer = new Server(httpServer, { /* options */ });

webSocketServer.on("connection", (socket) => {
    socket.on('join_room', async (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit('welcome');
    })
    socket.on('offer', (offer, roomName) => {
        socket.to(roomName).emit("offer", offer)
    })
    socket.on('answer', (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    })
    socket.on('ice', (ice, roomName) => {
        console.log(ice, roomName)
        socket.to(roomName).emit('ice', ice);
    })
});



httpServer.listen(3000);