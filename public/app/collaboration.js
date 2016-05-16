define("collaboration", ["jquery", "io", "brush"], function($, io, brush){

	var socket = io();
	var boardID;

	//Collaboration menu
	var button = $("#collaborate");
	var menu = $("#collaborate-menu");
	var join = $("#join");
	var id = $("#room-id");
	var close = $("#close");
	$(menu).hide();

	$(button).on("click", function(event){
		$(menu).show();
	});

	$(join).on("click", function(event){
		socket.emit("join-room", id.val());
		$(menu).hide();
	});

	$(close).on("click", function(){
		$(menu).hide();
	});

	socket.on("id", function(id){
		$("#board-id").text(id);
	});

	socket.on("line-drawn", function(data){
		brush.line(data.x1, data.y1, data.x2, data.y2);
	});

	socket.on("circle-drawn", function(data){
		brush.circle(data.x, data.y, data.r);
	});

	socket.on("rectangle-drawn", function(data){
		brush.rectangle(data.x, data.y, data.w, data.h);
	});

	socket.on("erase", function(data){
		brush.erase(data.x, data.y, 100);
	});

	return {
		socket: socket
	}
});