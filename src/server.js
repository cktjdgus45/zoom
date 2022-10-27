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

function publicRooms() {
    const { sids, rooms } = webSocketServer.sockets.adapter;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key)) {
            return;
        }
        publicRooms.push(key);
    })
    return publicRooms;
}

webSocketServer.on("connection", (socket) => {
    console.log(webSocketServer.sockets.adapter)
    socket["username"] = "Anonymous";
    socket.on('enter_room', (roomName, callback) => {
        socket.join(roomName);
        callback({
            status: "room is open sucessfully"
        });
        socket.to(roomName).emit("welcome", socket.username);
        webSocketServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.username));
    })
    socket.on("disconnect", () => {
        webSocketServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (message, room, callback) => {
        socket.to(room).emit('new_message', `${socket.username}:${message}`);
        callback();
    })
    socket.on("username", (name, callback) => {
        socket["username"] = name;
        callback({
            username: socket["username"]
        });
    })
});



httpServer.listen(3000);