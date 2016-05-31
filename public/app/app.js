requirejs.config({

	paths: {
		jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min",
		jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min",
		bootstrap: "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min",
		spectrum: "https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min",
		io: "http://cdn.socket.io/socket.io-1.4.5",
		snap: "https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg-min",
	}
});

requirejs(["jquery", "board", "io"], function($, board, io){
	
});