var game = {
	map_grid: {
		width: 24,
		height: 16,
		tile: {
			width: 16,
			height: 16
		}
	},

	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},

	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	}, 

	setWidth: function(w) {
		this.map_grid.tile.width = Math.round(w / this.map_grid.width); 
	},

	setHeight: function(h) {
		this.map_grid.tile.height = Math.round(h / this.map_grid.height);
	},

	start: function() {
		game.setWidth(800);
		game.setHeight(600);
		Crafty.init(game.width(), game.height());
		Crafty.background('#D8D8D8');
		Crafty.timer.steptype('variable');

		/*
		  Se activa en primera instancia la pantalla de carga. De no hacerlo,
		  los sprites no aparecerán.
		*/
		Crafty.scene('Loading');
	}
}