var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(80);

io.on("connection", function(socket) {
    socket.broadcast.emit("news", {msg: "User connected"});
})

app.get("/socket/send", function(req, res, next) {
    io.sockets.emit("news", {msg: "This is custom message"});
    next("Message send");
})