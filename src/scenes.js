var scene = function(name, backGround, entitys) {
	var _name = name || '',
		_backGround = backGround || game.createCanvas(game.width, game.height),
		_cached;

	game.entitys = entitys;
	_cached = game.renderToCanvas(game.width, game.height, function(ctx) {
		for(var i=0; i<game.entitys.length; i++) {
			if(game.entitys[i].isStatic()) {
				game.entitys[i].draw(ctx);
			}
		}
	});

	return {
		update: function(dt) {
			for(var i=0; i<game.entitys.length; i++) {
				if(!game.entitys[i].isStatic()) {
					game.entitys[i].update(dt);
				}
			}
		},
		draw: function() {
			game.ctx.drawImage(_backGround, 0, 0);
			game.ctx.drawImage(_cached, 0, 0);
			for(var i=0; i<game.entitys.length; i++) {
				if(!game.entitys[i].isStatic()) {
					game.entitys[i].draw(game.ctx);
				}
			}
		}
	};
}

var parent =  platform(30, 300, 400, 100);
var scene1 = scene('nivelPrueba', 
	game.renderToCanvas(game.width, game.height, function(ctx) {
		ctx.fillStyle = '#F2F2F2';
		ctx.fillRect(0, 0, game.width, game.height);
	}),
	[parent, platform(10, 100, 100, 100, 300, 100, 150), player(35, 270, 30, 30, 350, parent)]
);