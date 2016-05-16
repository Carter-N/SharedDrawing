define("menu", ["jquery", "colorPicker"], function($, colorPicker){

	colorPicker.init();

	var tool = {
		selected: "pen"
	}

	//Menu object
	var menu = [

		//Pen
		{id: "pen"},

		//Line
		{id: "circle"},

		//Rectangle
		{id: "rectangle"},

		//Circle
		{id: "line"},

		//Eraser
		{id: "eraser"},

		//Collaboration tool
		{id: "collaboration"}
	];

	var setSelectedTool = function(tool){
		this.selected = tool.currentTarget.id;
	};

	//Setup event listeners for buttons
	var init = function(){
		for(var i = 0; i < menu.length; i++){

			var button = menu[i];

			$("#" + button.id).click($.proxy(setSelectedTool, tool));
		}
	};

	return {
		menu: menu,
		init: init,	
		tool: tool,
		setSelectedTool: setSelectedTool
	};
});