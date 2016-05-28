define("colorPicker", ["jquery", "spectrum"], function($){

	var init = function(){
		$("#picker").spectrum({color: "#ffffff"});
	};

	return {
		init: init
	};
});