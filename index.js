//Modules
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var shortid = require("shortid");

//Server address
var port = 8080;
var url  = "http://localhost:" + port + "/";

app.use(express.static(__dirname + "/public"));

//Start server listening
server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/public/index.html");
});

//Client socket connection established
io.on("connection", function(socket){

    //Create board ID and join room
    var boardID = shortid.generate();
    socket.join(boardID);

    //Send ID to client
    socket.emit("id", boardID);

    socket.on("join-room", function(id){
        socket.leave(boardID);
        socket.join(id);
        boardID = id;
    });

    //Client drew a line
    socket.on("line-drawn", function(data){
        io.to(boardID).emit("line-drawn", data);
    });

    //Client drew a line
    socket.on("rectangle-drawn", function(data){
        io.to(boardID).emit("rectangle-drawn", data);
    });

    //Client drew a line
    socket.on("circle-drawn", function(data){
        io.to(boardID).emit("circle-drawn", data);
    });

    //Client drew a line
    socket.on("erase", function(data){
        io.to(boardID).emit("erase", data);
    });
});