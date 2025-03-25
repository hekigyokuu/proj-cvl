const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static("public"));

const io = require("socket.io")(server, {
    cors: { origin: "*" }
});

const users = {};

io.on("connection", (socket) => {
    socket.on("new user", (username) => {
        users[socket.id] = username;
        socket.broadcast.emit("chat message", `${username} has joined the chat.`);
    });

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        const username = users[socket.id]; 
        if (username) {
            delete users[socket.id]; 
            io.emit("chat message", `${username} has left the chat.`); 
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});