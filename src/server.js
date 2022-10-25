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
    socket.on('enter_room', (roomName, callback) => {
        socket.join(roomName);
        callback({
            status: "room is open sucessfully"
        });
        socket.to(roomName).emit("welcome");
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye"));
    })
    socket.on("new_message", (message, room, callback) => {
        socket.to(room).emit('new_message', message);
        callback();
    })
});



httpServer.listen(3000);