define("board", ["jquery", "brush", "menu", "collaboration", "snap"], function($, brush, menu, collaboration, snap){

	//Board element
	var board = $("#board");
	$(board).width(window.innerWidth);
	$(board).height(window.innerHeight);
	var paper = Snap("#board");

	//Setup menu and brush
	menu.init();
	brush.init(paper);

	//Mouse/touch object
	var mouse = {
		x: null,
		y: null,
		pressed: null,
		lastX: null,
		lastY: null
	};
    
    //Event handlers
    var onDown = function(event){
        
		actionStart.x = event.pageX;
		actionStart.y = event.pageY;
		mouse.pressed = true;
		trackMouse(event);
    };
    
    var onUp = function(event){
        
        //Handle line and rectangle drawing
		if(menu.tool.selected == "line"){
            
            var x1 = actionStart.x;
            var y1 = actionStart.y;
            var x2 = event.pageX;
            var y2 = event.pageY;
            
			brush.setColor(brush.getColor());
			brush.line(x1, y1, x2, y2);
			collaboration.line(x1, y1, x2, y2, brush.getColor());
		}

		if(menu.tool.selected == "circle"){
            
            var x = actionStart.x;
            var y = actionStart.y;
            var r = Math.sqrt(Math.pow(event.pageX - x, 2) + Math.pow(event.pageY - y, 2));
            
            brush.setColor(brush.getColor());
			brush.circle(x, y, r);

			collaboration.circle(x, y, r, brush.getColor());
		}

		if(menu.tool.selected == "rectangle"){
            
            var x = actionStart.x;
            var y = actionStart.y;
            var w = Math.abs(event.pageX - actionStart.x);
            var h = Math.abs(event.pageY - actionStart.y);
            
            brush.setColor(brush.getColor());
			brush.rectangle(x, y, w, h);
			collaboration.rectangle(x, y, w, h, brush.getColor());
		}

		mouse.pressed = false;
		trackMouse(event);
    }
    
    var onMove = function(event){
        trackMouse(event);

		if(mouse.pressed){

			if(menu.tool.selected === "pen"){
				brush.setColor(brush.getColor());
				brush.line(mouse.lastX, mouse.lastY, event.pageX, event.pageY);
				collaboration.line(mouse.lastX, mouse.lastY, event.pageX, event.pageY, brush.getColor());
			}

			if(menu.tool.selected === "eraser"){
				collaboration.socket.emit("erase", {
					x: mouse.x - 50, y: mouse.y - 50
				});
				brush.erase(mouse.x - 50, mouse.y - 50, 100);
			}
		}
    };

	//User draw action
	var actionStart = {x: 0, y: 0};
    
    //Track mouse/touch
	var trackMouse = function(event){
		mouse.lastX = mouse.x;
		mouse.lastY = mouse.y;
		mouse.x = event.pageX;
		mouse.y = event.pageY;
	};
    
    //Start action events
	$(board).on("touchstart", function(event){
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
		onDown(event);
	});
    
    $(board).on("mousedown", function(event){
        onDown(event);
	});
    
    $(board).on("mouseup", function(event){
        onUp(event);
	});

	$(board).on("touchend", function(event){
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
		onUp(event);
	});

	$(board).on("touchmove", function(event){
        
        if(event.target.id = "board"){
			event.preventDefault();
		}
        
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
		onMove(event);
	});

	$(board).on("mousemove", function(event){
		onMove(event);
	});

	return {
		board: board,
		mouse: mouse
	};
});