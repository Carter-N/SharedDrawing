define("brush", ["jquery", "spectrum", "snap"], function($, spectrum, snap){

	var paper = null;
	var color = null;

	//Initialize the brush
	var init = function(_paper){
		paper = _paper;
	};

	//Get and set color of brush
	var setColor = function(_color){
		color = _color;
	};

	var getColor = function(){
		var picker = $("#picker").spectrum("get");
		return picker.toRgbString();
	};

	//Draw a rectangle on the board
	var rectangle = function(x, y, width, height){
		var rectangle = paper.rect(x, y, width, height);
		rectangle.attr({
			strokeWidth: 2,
			stroke: color
		});
	};

	//Draw a circle on the board
	var circle = function(x, y, r){
		var t = $("#picker").spectrum("get");
		var circle = paper.circle(x, y, r);
		circle.attr({
			strokeWidth: 2,
			stroke: t.toRgbString()
		});
	};

	//Draw a line
	var line = function(x0, y0, x1, y1){
		var line = paper.line(x0, y0, x1, y1);
		line.attr({
			strokeWidth: 2,
			stroke: color
		});
	};

	return{
		rectangle: rectangle,
		init: init,
		color: color,
		setColor: setColor,
		getColor: getColor,
		line: line,
		circle: circle
	}
});