define("board", ["jquery", "brush", "menu", "collaboration"], function($, brush, menu, collaboration){

	//Setup menu
	menu.init();

	//Board canvas
	var canvas = document.getElementById("board");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	//Board context
	var context = canvas.getContext("2d");

	//Setup brush
	brush.init(canvas, context);

	//Mouse event listening
	var mouse = {
		x: null,
		y: null,
		pressed: null,
		lastX: null,
		lastY: null
	};

	//Brush action parameters
	var actionStart = {x: 0, y: 0};

	var trackMouse = function(event){
		mouse.lastX = mouse.x;
		mouse.lastY = mouse.y;
		mouse.x = event.clientX;
		mouse.y = event.clientY;
	};

	canvas.addEventListener("touchstart", function(event){

		event.clientX = event.changedTouches[0].pageX;
		event.clientY = event.changedTouches[0].pageY;

		//Handle line and rectangle drawing
		actionStart.x = event.clientX;
		actionStart.y = event.clientY;

		mouse.pressed = true;
		trackMouse(event);
	});

	canvas.addEventListener("touchend", function(event){

		event.clientX = event.changedTouches[0].pageX;
		event.clientY = event.changedTouches[0].pageY;

		//Handle line and rectangle drawing
		if(menu.tool.selected == "line"){
			brush.line(actionStart.x, actionStart.y, event.clientX, event.clientY);
			collaboration.socket.emit("line-drawn", {
				x1: actionStart.x, y1: actionStart.y, x2: event.clientX, y2: event.clientY
			});
		}

		if(menu.tool.selected == "circle"){
			var distance = Math.sqrt(Math.pow(event.clientX - actionStart.x, 2) + Math.pow(event.clientY - actionStart.y, 2));
			brush.circle(actionStart.x, actionStart.y, distance);

			collaboration.socket.emit("circle-drawn", {
				x: actionStart.x, y: actionStart.y, r: distance
			});
		}

		if(menu.tool.selected == "rectangle"){
			brush.rectangle(actionStart.x, actionStart.y, event.clientX - actionStart.x, event.clientY - actionStart.y);
			collaboration.socket.emit("rectangle-drawn", {
				x: actionStart.x, y: actionStart.y, w: event.clientX - actionStart.x, h: event.clientY - actionStart.y
			});
		}

		mouse.pressed = false;
		trackMouse(event);
	});

	canvas.addEventListener("touchmove", function(event){

		event.clientX = event.changedTouches[0].pageX;
		event.clientY = event.changedTouches[0].pageY;

		trackMouse(event);

		if(event.target.id = "board"){
			event.preventDefault();
		}
		
		if(mouse.pressed){

			if(menu.tool.selected === "pen"){
				brush.line(mouse.lastX, mouse.lastY, mouse.x, mouse.y);
				collaboration.socket.emit("line-drawn", {
					x1: mouse.lastX, y1: mouse.lastY, x2: mouse.x, y2: mouse.y
				});
			}

			if(menu.tool.selected === "eraser"){
				collaboration.socket.emit("erase", {
					x: mouse.x - 50, y: mouse.y - 50
				});
				brush.erase(mouse.x - 50, mouse.y - 50, 100);
			}
		}
	});

	canvas.addEventListener("mousemove", function(event){
		trackMouse(event);

		if(mouse.pressed){

			if(menu.tool.selected === "pen"){
				brush.line(mouse.lastX, mouse.lastY, mouse.x, mouse.y);
				collaboration.socket.emit("line-drawn", {
					x1: mouse.lastX, y1: mouse.lastY, x2: mouse.x, y2: mouse.y
				});
			}

			if(menu.tool.selected === "eraser"){
				collaboration.socket.emit("erase", {
					x: mouse.x - 50, y: mouse.y - 50
				});
				brush.erase(mouse.x - 50, mouse.y - 50, 100);
			}
		}
	});

	canvas.addEventListener("mousedown", function(event){

		//Handle line and rectangle drawing
		actionStart.x = event.clientX;
		actionStart.y = event.clientY;

		mouse.pressed = true;
		trackMouse();
	});

	canvas.addEventListener("mouseup", function(event){

		//Handle line and rectangle drawing
		if(menu.tool.selected == "line"){
			brush.line(actionStart.x, actionStart.y, event.clientX, event.clientY);
			collaboration.socket.emit("line-drawn", {
				x1: actionStart.x, y1: actionStart.y, x2: event.clientX, y2: event.clientY
			});
		}

		if(menu.tool.selected == "circle"){
			var distance = Math.sqrt(Math.pow(event.clientX - actionStart.x, 2) + Math.pow(event.clientY - actionStart.y, 2));
			brush.circle(actionStart.x, actionStart.y, distance);

			collaboration.socket.emit("circle-drawn", {
				x: actionStart.x, y: actionStart.y, r: distance
			});
		}

		if(menu.tool.selected == "rectangle"){
			brush.rectangle(actionStart.x, actionStart.y, event.clientX - actionStart.x, event.clientY - actionStart.y);
			collaboration.socket.emit("rectangle-drawn", {
				x: actionStart.x, y: actionStart.y, w: event.clientX - actionStart.x, h: event.clientY - actionStart.y
			});
		}

		mouse.pressed = false;
		trackMouse();
	});

	return {
		canvas: canvas,
		mouse: mouse,
		context: context
	};
});