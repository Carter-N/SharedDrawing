requirejs.config({

	paths: {
		jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min",
		bootstrap: "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min",
		spectrum: "https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min",
		io: "https://cdn.socket.io/socket.io-1.4.5"
	}
});

requirejs(["jquery", "board", "io"], function($, board, io){
	
});