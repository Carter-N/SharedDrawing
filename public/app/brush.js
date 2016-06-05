/**
* Module contains drawing methods and tracking.
*/
define("brush", ["jquery", "spectrum", "snap"], function($, spectrum, snap){
    
    //SVG drawing context
	/** @private */ var paper = null;
    
    //Current color of the brush
	/** @private */ var color = null;
    
    //Nested group
    var g = null;

	/**
    * Initializes the brush with the SVG drawing context.
    * 
    * @param {Paper} _paper The SVG drawing context.
    */
	var init = function(_paper){
		paper = _paper;
        g = paper.g();
        console.log(g)
	};
    
    var translate = function(x, y){
        var t = "t" + x + "," + y;
        g.transform(t);
    };
    
    var scale = function(x, y){
        var t = "s" + x + "," + y;
        g.transform(t);
    };

	/**
    * Set the current color of the brush.
    *
    * @param {String} _color The color to set the current color to.
    */
	var setColor = function(_color){
		color = _color;
	};
    
    /**
    * Get the current color of the picker spectrum.
    */
	var getColor = function(){
		var picker = $("#picker").spectrum("get");
		return picker.toRgbString();
	};

	/**
    * Draw a rectangle on the board.
    *
    * @param {Number} x The x coordinate of the rectangle.
    * @param {Number} y The y coordinate of the rectangle.
    * @param {Number} width The width of the rectangle.
    * @param {Number} height The height of the rectangle.
    */
	var rectangle = function(x, y, width, height){
		var rectangle = paper.rect(x, y, width, height); 
		rectangle.attr({
			strokeWidth: 2,
			stroke: color,
            fill: "none"
		});
        g.add(rectangle);
	};

	/**
    * Draw a circle on the board.
    *
    * @param {Number} x The x coordinate of the circle.
    * @param {Number} y The y coordinate of the circle.
    * @param {Number} r The radius of the circle.
    */
	var circle = function(x, y, r){
		var t = $("#picker").spectrum("get");
		var circle = paper.circle(x, y, r);
		circle.attr({
			strokeWidth: 2,
			stroke: t.toRgbString(),
            fill: "none"
		});
        g.add(circle);
	};

	/**
    * Draw a line on the board.
    *
    * @param {Number} x1 The x coordinate of the first point of the line.
    * @param {Number} y1 The y coordinate of the first point of the line.
    * @param {Number} y2 The x coordinate of the second point of the line.
    * @param {Number} y2 The y coordinate of the second point of the line.
    */
	var line = function(x1, y1, x2, y2){
		var line = paper.line(x1, y1, x2, y2);
		line.attr({
			strokeWidth: 2,
			stroke: color
		});
        g.add(line);
	};

	return { 
		init: init,
		setColor: setColor,
		getColor: getColor,
        rectangle: rectangle,
		circle: circle,
        line: line,
        translate: translate,
        scale: scale
	};
});