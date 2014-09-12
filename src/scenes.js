var scene = function(name, backGround, entitys) {
	var _name = name || '',
		_entitys = entitys,
		_backGround = backGround || game.createCanvas(game.width, game.height),
		_cached;

	console.log(_entitys);
	_cached = game.renderToCanvas(game.width, game.height, function(ctx) {
		for(var i=0; i<_entitys.length; i++) {
			if(_entitys[i].isStatic()) {
				_entitys[i].draw(ctx);
			}
		}
	});

	return {
		update: function(dt) {
			for(var i=0; i<_entitys.length; i++) {
				if(!_entitys[i].isStatic()) {
					_entitys[i].update(dt);
				}
			}
		},
		draw: function() {
			game.ctx.drawImage(_backGround, 0, 0);
			game.ctx.drawImage(_cached, 0, 0);
			for(var i=0; i<_entitys.length; i++) {
				if(!_entitys[i].isStatic()) {
					_entitys[i].draw(game.ctx);
				}
			}
		}
	};
}

var scene1 = scene('nivelPrueba', 
	game.renderToCanvas(game.width, game.height, function(ctx) {
		ctx.fillStyle = '#F2F2F2';
		ctx.fillRect(0, 0, game.width, game.height);
	}),
	[actor(10, 10, 20, 20, true), platform(10, 100, 40, 40, 300, 100, 350)]
);