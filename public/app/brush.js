define("brush", ["jquery", "spectrum"], function($){

	var canvas = null;
	var context = null;

	//Initialize the brush
	var init = function(_canvas, _context){
		canvas = _canvas;
		context = _context;
	};

	//Clear a board
	var clearBoard = function(){
		context.fillStyle = "rgb(0, 0, 0)";
		context.fillRect(0, 0, canvas.width, canvas.height);
	};

	//Erase a section of the board
	var erase = function(x, y, r){
		context.strokeStyle = "rgb(0, 0, 0)";
		context.fillStyle = "rgb(0, 0, 0)";
		context.beginPath();
		context.arc(x, y, r, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();
	};

	//Draw a rectangle on the board
	var rectangle = function(x, y, width, height){
		var t = $("#picker").spectrum("get");
		context.fillStyle = t.toRgbString();
		context.strokeRect(x, y, width, height);
	};

	//Draw a circle on the board
	var circle = function(x, y, r){
		var t = $("#picker").spectrum("get");
		context.fillStyle = t.toRgbString();
		context.beginPath();
		context.lineWidth = 2;
		context.arc(x, y, r, 0, 2 * Math.PI, false);
		context.stroke();
	};

	//Draw a line
	var line = function(x0, y0, x1, y1){
		var t = $("#picker").spectrum("get");
		context.strokeStyle = t.toRgbString();
		context.lineWidth = 2;
		context.beginPath();
		context.quadraticCurveTo(x0, y0, x1, y1);
		context.stroke();
	};

	return{
		clearBoard: clearBoard,
		rectangle: rectangle,
		init: init,
		color: color,
		line: line,
		erase: erase,
		circle: circle
	}
});