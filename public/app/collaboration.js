define("collaboration", ["jquery", "io", "brush"], function($, io, brush){

	//Connect web socket server
	var socket = io();
    
    //Current board
	var board;
    
    //Current client info
    var client;

	//Collaboration menu
	var button = $("#collaborate");
	var menu = $("#collaborate-menu");
	var join = $("#join");
	var id = $("#room-id");
    var name = $("#name");
	var close = $("#close");
    var users = $("#users");
	
	//Initially hide menu
	$(menu).hide();

	//Menu events
	$(button).on("click", function(event){
		$(menu).show();
	});

	$(join).on("click", function(event){
		socket.emit("join-room", {
            id: id.val(),
            name: name.val()
        });
		$(menu).hide();
	});

	$(close).on("click", function(){
		$(menu).hide();
	});

	//Socket outbound communications
	var line = function(x1, y1, x2, y2, color){
		socket.emit("action", {
			action: 0, x1: x1, y1: y1, x2: x2, y2: y2, color: color
		});
	};
    
    var circle = function(x, y, r, color){
		socket.emit("action", {
			action: 1, x: x, y: y, r: r, color: color
		});
	};
    
    var rectangle = function(x, y, w, h, color){
		socket.emit("action", {
			action: 2, x: x, y: y, w: w, h: h, color: color
		});
	};
    
    var updateUsers = function(data){
        $(users).empty();
        
        console.log(data);
        
        for(user in data){ 
            console.log(user);
            
            if(data[user].p){
                $(users).append("<div class='user' id=" + user + ">" + data[user].name + "<button class='perm granted' type='button'>p</button></div>");
            }else{
                $(users).append("<div class='user' id=" + user + ">" + data[user].name + "<button class='perm denied' type='button'>p</button></div>");
            }
        }
        
        $(".perm").on("click", function(event){
            
            var user = event.target.id;
            
            board.clients[user].p = !board.clients[user].p;
            
            //Toggle user permissions
            socket.emit("permissions-changed", board.clients);
            updateUsers(board.clients);
        });
    };

	//Socket inbound communications
    socket.on("join-room-sucess", function(data){
        loadBoard(data.board.actions);
        console.log("Joined board");
        board = data.board;
        updateUsers(board.clients);
    });
    
    socket.on("permissions-changed", function(data){
        updateUsers(data);
    });
    
    socket.on("join-room-failed", function(){
        console.log("Failed to join board");
    });
    
	socket.on("id", function(data){
		$("#board-id").text(data.board.id);
        board = data.board;
        client = data.client;
        
        //Add user to list
        updateUsers(data.board.clients);
	});
    
    socket.on("client-joined", function(data){
        updateUsers(data);
    });
    
    socket.on("client-left", function(data){
        console.log("Client left");
        updateUsers(data);
    });

	socket.on("action", function(data){
        handleAction(data);
	});

	socket.on("erase", function(data){
		brush.erase(data.x, data.y, 100);
	});
    
    var loadBoard = function(actions){
        
        for(var i = 0; i < actions.length; i++){
            handleAction(actions[i]);
        }
    };
    
    var handleAction = function(data){
        
        //Line drawn
		if(data.action == 0){
			brush.setColor(data.color);
			brush.line(data.x1, data.y1, data.x2, data.y2);
		}
        
        //Circle drawn
        if(data.action == 1){
			brush.setColor(data.color);
			brush.circle(data.x, data.y, data.r);
		}
        
        //Rectangle drawn
        if(data.action == 2){
			brush.setColor(data.color);
			brush.rectangle(data.x, data.y, data.w, data.h);
		}
    };

	return {
		socket: socket,
		line: line,
        circle: circle,
        rectangle: rectangle
	};
});