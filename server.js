const express = require("express");
const path = require("path");
const compression = require("compression");
const socketIO = require("socket.io");
const dotenv = require("dotenv").config();
const challenges = require("./challenges");
// const open = require("open");

const port = process.env.PORT || 3000;
const app = express();
app.use(compression());

app.use((req, res, next) => {
    var allowedOrigins = ["http://localhost:8080"];
    var origin = req.headers.origin;

    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
    next();
});

app.get("/api/v1/challenges", (req, res, next) => {
    res.json(challenges);
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/dist")));
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "client/dist", "index.html"));
    });
}

const server = app.listen(port, function(err) {
    if (err) {
        console.log(err);
    } else {
        // open(`http://localhost:${port}`);
        console.log(`Server is up on port ${port}`);
    }
});

const io = socketIO(server);

io.on("connection", socket => {
    console.log("a user connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("room", function(data) {
        console.log("in joining room in SERVER");
        socket.join(data.room);
        console.log(data);
        socket.broadcast.to(data.room).emit("load users and code");
        socket.broadcast.to(data.room).emit("new user join", data.user);
    });

    socket.on("leave room", function(data) {
        socket.broadcast
            .to(data.room)
            .emit("user left room", { user: data.user });
        socket.leave(data.room);
    });

    socket.on("coding event", function(data) {
        console.log("in EXPRESS coding event");
        console.log(data);
        socket.broadcast.to(data.room).emit("receive code", {
            code: data.code,
            currentlyTyping: data.currentlyTyping
        });
    });
    socket.on("change mode", function(data) {
        socket.broadcast.to(data.room).emit("receive change mode", data.mode);
    });

    socket.on("send users and code", function(data) {
        socket.broadcast.to(data.room).emit("receive users and code", data);
    });
});
