/**
* Module contains function involving client to client communication.
*/
define("collaboration", ["jquery", "io", "brush"], function($, io, brush){

	//Socket server instace
	/** @private */ var socket = io();
    
    //Refrence to server board
	/** @private */ var board;
    
    //Current client information
    /** @private */ var client;

	//Collaboration menu
	/** @private */ var button = $("#collaborate");
	/** @private */ var menu = $("#collaborate-menu");
	/** @private */ var join = $("#join");
	/** @private */ var id = $("#room-id");
    /** @private */ var name = $("#name");
	/** @private */ var close = $("#close");
    
    //Users panel
    /** @private */ var users = $("#users");
    
    //Save
    /** @private */ var saveButton = $("#save");
	
	//Hide collaboration menu
	$(menu).hide();

    //Save a board
    $()
    
	//Show menu
	$(button).on("click", function(event){
		$(menu).show();
	});
    
    //Hide menu
    $(close).on("click", function(){
		$(menu).hide();
	});
    
    //Attempt to join a room
	$(join).on("click", function(event){
        
        //Emit join event
		socket.emit("join-room", {
            id: id.val(),
            name: name.val()
        });
        
        //Clear input
        id.val("");
        name.val("");
        
        //Hide menu
		$(menu).hide();
	});

	/**
    * Client line drawn event callback.
    *
    * @param {Number} x1 The x coordinate of the first point of the line.
    * @param {Number} y1 The y coordinate of the first point of the line.
    * @param {Number} x2 The x coordinate of the second point of the line.
    * @param {Number} y2 The y coordinate of the second point of the line.
    * @param {String} color The color of the line.
    */
	var line = function(x1, y1, x2, y2, color){
		socket.emit("action", {
			action: 0, x1: x1, y1: y1, x2: x2, y2: y2, color: color
		});
	};
    
    /**
    * Client circle drawn event callback.
    *
    * @param {Number} x The x coordinate of the circle.
    * @param {Number} y The y coordinate of the circle.
    * @param {Number} r The radius of the circle.
    * @param {String} color The color of the circle.
    */
    var circle = function(x, y, r, color){
		socket.emit("action", {
			action: 1, x: x, y: y, r: r, color: color
		});
	};
    
    /**
    * Client line drawn event callback.
    *
    * @param {Number} x1 The x coordinate of the first point of the line.
    * @param {Number} y1 The y coordinate of the first point of the line.
    * @param {Number} x2 The x coordinate of the second point of the line.
    * @param {Number} y2 The y coordinate of the second point of the line.
    * @param {String} color The color of the line.
    */
    var rectangle = function(x, y, w, h, color){
		socket.emit("action", {
			action: 2, x: x, y: y, w: w, h: h, color: color
		});
	};
    
    var updateUsers = function(data){
        $(users).empty();
        
        for(var user in data){ 
            
            if(data[user].p){
                $(users).append("<div class='user'><button id=" + user + " class='btn btn-danger perm' type='button'><span id=" + user + " class='glyphicon glyphicon-remove' aria-hidden='true'></span></button>" + data[user].name + "</div>");
            }else{
                $(users).append("<div class='user'><button id=" + user + " class='btn btn-success perm' type='button'><span id=" + user + " class='glyphicon glyphicon-ok' aria-hidden='true'></span></button>" + data[user].name + "</div>");
            }
        }
        
        $(".perm").on("click", function(event){
            
            var user = event.target.id;
            
            console.log(user);
            
            board.clients[user].p = !board.clients[user].p;
            
            //Toggle user permissions
            socket.emit("permissions-changed", board.clients);
            updateUsers(board.clients);
        });
    };

	//Socket inbound communications
    socket.on("join-room-sucess", function(data){
        loadBoard(data.board.actions);
        board = data.board;
        updateUsers(board.clients);
    });
    
    socket.on("permissions-changed", function(data){
        updateUsers(data);
    });
    
    socket.on("join-room-failed", function(){
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
		if(data.action === 0){
			brush.setColor(data.color);
			brush.line(data.x1, data.y1, data.x2, data.y2);
		}
        
        //Circle drawn
        if(data.action === 1){
			brush.setColor(data.color);
			brush.circle(data.x, data.y, data.r);
		}
        
        //Rectangle drawn
        if(data.action === 2){
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