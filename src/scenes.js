Crafty.scene('Game', function() {



	Crafty.e('Pared').at(0, 0).setWidth(game.map_grid.width);
	Crafty.e('Pared').at(0, 1).setHeight(game.map_grid.height);
	Crafty.e('Pared').at(game.map_grid.width - 1, 0).setHeight(game.map_grid.height);
	Crafty.e('Pared').at(0, game.map_grid.height - 1).setWidth(game.map_grid.width);
	Crafty.e('Plataforma').at(3, 5).setWidth(1).setHeight(3).crearMovimiento(7, 5, 100, 0);
	Crafty.e('Plataforma').at(14, 6).setWidth(3).setHeight(1);
	Crafty.e('Plataforma').at(15, 13).setWidth(1).setHeight(1);
	Crafty.e('Plataforma').at(20, 12).setWidth(1).setHeight(2);
	Crafty.e('Plataforma').at(19, 3).setWidth(3).setHeight(1);
	Crafty.e('Trampa').at(11, 4).setWidth(1).setHeight(1).crearMovimiento(11, 8, 0, 100);
	Crafty.e('Trampa').at(12, 11).setWidth(1).setHeight(1).crearMovimiento(18, 11, 100, 0);
	Crafty.e('Trampa').at(18, 9).setWidth(1).setHeight(1).crearMovimiento(22, 10, 100, 0);
	Crafty.e('Trampa').at(18, 5).setWidth(1).setHeight(1).crearMovimiento(22, 5, 50, 0);
	Crafty.e('Meta').at(20, 2);

	var plataforma1 = Crafty.e('Plataforma').at(3, 11).setWidth(8).setHeight(1);
	var player = Crafty.e('PlayerCharacter').at(7, 10).setPadre(plataforma1);
 
});


/*
  Pantalla de carga, imperceptible por el usuario...
*/
Crafty.scene('Loading', function() {
	Crafty.load(['assets/spiked_ball.png', 'assets/coin.png', 'assets/blank.png'], function() {

	  Crafty.sprite(33, 38, 'assets/spiked_ball.png', {
	  	spr_spike: [0, 0]
	  });

	  Crafty.sprite(33, 38, 'assets/coin.png', {
 		spr_coin: [0, 0]
	  });

	  Crafty.sprite(33, 38, 'assets/blank.png', {
	  	spr_blank: [0, 0]
	  });

	Crafty.scene('Game');

	});

	Crafty.audio.add('jump', 'assets/jump.mp3');
});