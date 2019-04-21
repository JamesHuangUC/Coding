const express = require("express");
const path = require("path");
const compression = require("compression");
const socketIO = require("socket.io");
const dotenv = require("dotenv").config();
const moment = require("moment");
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

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "client/dist")));
//     app.get("*", function(req, res) {
//         res.sendFile(path.join(__dirname, "client/dist", "index.html"));
//     });
    app.use('/coding', express.static(path.join(__dirname, "client/coding"))); //production env for local server
// }

const server = app.listen(port, function(err) {
    if (err) {
        console.log(err);
    } else {
        // open(`http://localhost:${port}`);
        console.log(`Server is up on port ${port}`);
    }
});

function generateMessage(from, text) {
    const message = { from, text, createdAt: moment().valueOf() };
    console.log(message);
    return message;
    // return { from, text, createdAt: moment().valueOf() };
}

const io = socketIO(server);

io.set('origins', 'http://localhost:3000 http://localhost:8080');
// io.set('origins', 'https://icoding.herokuapp.com:* https://www.zihuahuang.com:*');

var users = {};
var colors = ["#DDFFAA", "#95E0C8", "#E18060", "#FFCBA4"];
var tempUser;
var tempColor;

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

        if (Object.keys(users).length === 0 || !(data.room in users)) {
            users[data.room] = {};
        }
        if (
            Object.keys(users[data.room]).length === 0 ||
            !(data.user in users[data.room])
        ) {
            users[data.room][data.user] = {};
            users[data.room][data.user] = {};
        }
        users[data.room][data.user].user = tempUser = data.user;
        users[data.room][data.user].color = data.color = tempColor =
            colors[Math.floor(Math.random() * colors.length)];
        socket.emit("userdata", Object.values(users[data.room]));
        socket.broadcast.to(data.room).emit("connected user and color", data);
    });

    socket.on("leave room", function(data) {
        socket.broadcast
            .to(data.room)
            .emit("user left room", { user: data.user });
        socket.leave(data.room);

        console.log("leave", data);
        if (
            Object.keys(users).length !== 0 &&
            typeof users[data.room][data.user] !== "undefined"
        ) {
            socket.broadcast
                .to(data.room)
                .emit("exit", users[data.room][data.user].user);
            delete users[data.room][data.user];
        }
    });

    socket.on("coding event", function(data) {
        console.log("in EXPRESS coding event");
        console.log(data);
        socket.broadcast.to(data.room).emit("receive code", {
            code: data.code,
            currentlyTyping: data.currentlyTyping
        });
    });
    // socket.on("change language", function(data) {
    //     socket.broadcast.to(data.room).emit("receive change language", data.language);
    // });

    socket.on("send users and code", function(data) {
        socket.broadcast.to(data.room).emit("receive users and code", data);
    });

    socket.on("createMessage", message => {
        console.log(message);
        io.to(message.room).emit(
            "toClientMessage",
            generateMessage(message.userName, message.text)
        );
    });

    socket.on("selection", function(data) {
        //Content Select Or Cursor Change Event
        if (typeof users[data.room][data.user] === "undefined") {
            data.color = tempColor;
        } else {
            data.color = users[data.room][data.user].color;
        }
        socket.broadcast.to(data.room).emit("selection", data);
    });

    socket.on("key", function(data) {
        //Getting code when others editing
        // console.log("kd", data);
        // console.log("tu", tempUser);
        // if (Object.keys(users[data.room]).length !== 0 && tempUser in users[data.room]) {
        if (Object.keys(users[data.room]).length !== 0) {
            // data.user = users[data.room][tempUser].user;
            socket.broadcast.to(data.room).emit("key", data);
        }
        // }
    });

    socket.on("filedata", function(data) {
        //Getting code when connected
        socket.broadcast.to(data.room).emit("resetdata", data.code);
    });
});
