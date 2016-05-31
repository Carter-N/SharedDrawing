/**
* Module contains board information and controls board events.
*/
define("board", ["jquery", "brush", "menu", "collaboration", "snap"], function($, brush, menu, collaboration, snap){

	//Board element
	var board = $("#board");
	
    //Board drawing context
	var paper = Snap("#board");
    
    //Panning parameters
    /** @private */ var boardX = 0;
    /** @private */ var boardY = 0;
    
	//Initialize menu and brush
	menu.init();
	brush.init(paper);

	//Mouse/touch information
	/** @private */ var mouse = {
		x: null,
		y: null,
		pressed: null,
		lastX: null,
		lastY: null
	};
    
    //User action tracking
	/** @private */ var actionStart = {x: 0, y: 0};
    
    /**
    * Update information about the mouse/touch.
    *
    * @param {Event} event The currently tracked event. 
    */
	var trackMouse = function(event){
		mouse.lastX = mouse.x;
		mouse.lastY = mouse.y;
		mouse.x = event.pageX;
		mouse.y = event.pageY;
	};
    
    /**
    * Handles a window resize event.
    */
    var onResize = function(){
        $(board).width(window.innerWidth);
        $(board).height(window.innerHeight);
    };
    
    /**
    * Handles a touch/mouse down event.
    *
    * @param {Event} event The tracked event.
    */
    var onDown = function(event){
		actionStart.x = event.pageX;
		actionStart.y = event.pageY;
		mouse.pressed = true;
		trackMouse(event);
    };
    
    /**
    * Handles a touch/mouse down event.
    *
    * @param {Event} event The tracked event.
    */
    var onUp = function(event){
        
        trackMouse(event);
        
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
    };
    
    /**
    * Handles a touch/mouse move event.
    *
    * @param {Event} event The tracked event.
    */
    var onMove = function(event){
        
        trackMouse(event);

		if(mouse.pressed){

			if(menu.tool.selected === "pen"){
				brush.setColor(brush.getColor());
				brush.line(mouse.lastX, mouse.lastY, event.pageX, event.pageY);
				collaboration.line(mouse.lastX, mouse.lastY, event.pageX, event.pageY, brush.getColor());
			}
            
            if(menu.tool.selected === "pan"){
                //boardX += (mouse.x - mouse.lastX);
                //boardY += (mouse.y - mouse.lastY);
                //var element = $("#board");
                
                //var raw = $(element).attr("transform");
                //var transform = /matrix\(\s*([^\s,)]+)[ ,]([^\s,)]+)[ ,]([^\s,)]+)[ ,]([^\s,)]+)[ ,]([^\s,)]+)[ ,]([^\s,)]+)/.exec(raw);

                //var x = transform[5];
                //var y = transform[6];

                //console.log(x, y);

                //$(element).attr("transform", "matrix(1 0 0 1 " + boardX + " " + boardY +")");
            }

			if(menu.tool.selected === "eraser"){
				//collaboration.socket.emit("erase", {
				//	x: mouse.x - 50, y: mouse.y - 50
				//});
				//brush.erase(mouse.x - 50, mouse.y - 50, 100);
			}
		}
    };
    
    //Window resize event
    $(window).on("resize", onResize);
    
    //Touch start event
	$(board).on("touchstart", function(event){
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
		onDown(event);
	});
    
    //Touch end event
    $(board).on("touchend", function(event){
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
		onUp(event);
	});
    
    //Touch move event
	$(board).on("touchmove", function(event){
        
        if(event.target.id === "board"){
			event.preventDefault();
		}
        
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
		onMove(event);
	});
    
    //Mouse start event
    $(board).on("mousedown", onDown);
    
    //Mouse up event
    $(board).on("mouseup", onUp);
    
    //Mouse move event
	$(board).on("mousemove", onMove);
    
    //Fit the board to window
    onResize();

	return {
		board: board,
		mouse: mouse,
        paper: paper
	};
});