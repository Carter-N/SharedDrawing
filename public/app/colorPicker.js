define("colorPicker", ["jquery", "spectrum"], function($){

	var init = function(){
		$("#picker").spectrum({color: "#2D2E30"});
	};

	return {
		init: init
	};
});