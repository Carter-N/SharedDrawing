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
console.log("Server listening on port " + port);
console.log(url);

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/public/index.html");
});

//Active boards
var boards = {};

//Active clients
var clients = {};

//Client socket connection established
io.on("connection", function(socket){

    //Create new board
    var board = {
        id: shortid.generate(),
        clients: {},
        actions: []
    }
    boards[board.id] = board;
    socket.join(board.id);
    
    //Create new client
    var client = {
        id: shortid.generate(),
        board: board.id
    };
    clients[client.id] = client;
    
    //Add client to board as a host
    board.clients[client.id] = {
        id: client.id,
        name: "You",
        p: true,
        host: true
    };
    
    console.log("Board created with id: " + board.id);

    //Send ID to client
    socket.emit("id", {
        board: board,
        client: client
    });
    
    socket.on("permissions-changed", function(data){
        socket.broadcast.to(board.id).emit("permissions-changed", data); 
    });

    socket.on("join-room", function(data){
        
        //Check for room existance
        if(board.id in boards){
            
            //Sucess
            socket.leave(client.board);
            socket.join(data.id);
            client.board = data.id;
            
            //Add client to board roster
            board = boards[client.board];
            board.clients[client.id] = {name: data.name, p: false, host: false};
            
            //Alert other board users of new client connection
            socket.broadcast.to(board.id).emit("client-joined", board.clients);
            
            console.log(data.name + " joined board with id: " + board.id);
            
            socket.emit("join-room-sucess", {
                board: board
            });
        }else{
            
            //Failure
            socket.emit("join-room-failed");
        }
    });

    //Client preformed an action
    socket.on("action", function(data){
        board.actions.push(data);
        socket.broadcast.to(board.id).emit("action", data);
    });
    
    //Client disconnected
    socket.on("disconnect", function(){
        
        if(board.clients[client.id].host === true){
            
            //Destroy board and client
            console.log("Destroying board " + board.id + " and client " + client.id);
            delete boards[board.id];
            delete clients[client.id];
        }else{
            
            //Assume not host
            console.log("Client leaving board " + board.id + " and destroying client " + client.id);
            delete board.clients[client.id];
            socket.broadcast.to(board.id).emit("client-left", board.clients);
        }
    });
});