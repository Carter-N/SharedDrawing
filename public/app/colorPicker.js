define("colorPicker", ["jquery", "spectrum"], function($){

	//Object to proxy to in pick event
	var color = {
		selected: [70, 50, 20]
	};

	var init = function(){
		$("#picker").spectrum({color: "#ffffff"});
	};

	return { 
		color: color,
		init: init
	};
});