var actor = function(x, y, width, height, isStatic, color, id) {
	var _x, 
		_y,
		_w,
		_h,
		_color,
		_static,
		_id;

	_id = id;
	_x = x || 0;
	_y = y || 0;
	_w = width || 0;
	_h = height || 0;
	_color = color || 'rgb(255, 255, 255)';
	_static = isStatic || false;

	return {
		isStatic: function() {
			return _static;
		},

		move: function(dx, dy) {
			_x += dx;
			_y += dy;
		},

		setX: function(x) {
			_x = x;
		},

		setY: function(y) {
			_y = y;
		},

		getX: function() {
			return _x;
		},

		getY: function() {
			return _y;
		},

		setSize: function(width, height) {
			_w = width;
			_h = height;
		},

		getWidth: function() {
			return _w;
		},

		getHeight: function() {
			return _h;
		},

		setColor: function(color) {
			_color = color;
		},

		draw: function(ctx) {
			ctx.fillStyle = _color;
			ctx.fillRect(_x, _y, _w, _h);
			if(_id === 'player') {
				console.log('x: ' + _x + ', y: ' + _y + ', w: ' + _w + ', h: ' + _h);
			}
		}
	}
};
var platform = function (x, y, width, height, xf, yf, speed) {
	var that;
	var d, vx, vy;

	d = Math.sqrt(Math.pow(xf - x, 2) + Math.pow(yf - y, 2));
	vx = speed * (xf-x)/d;
	vy = speed * (yf-y)/d;

	if(xf && yf && speed) {
		that = actor(x, y, width, height, false, 'black', 'platform');
	}
	else {
		that = actor(x, y, width, height, true, 'black', 'platform');
	}

	that.update =  function(dt) {
		var dx, dy;

		if(speed >= 0) {
			dx = Math.round(vx*dt);
			dy = Math.round(vy*dt);
		}
		else {
			dx = Math.round(vx*dt);
			dy = Math.round(vy*dt);
		}
		that.move(dx, dy);
		if(that.getX() < x && vx < 0 || that.getX() >= xf && vx >0) {
			vx = vx * - 1;
			vy = vy * - 1;
		}
	};

	return that;
};

var player = function(x, y, width, height, speed, parent) {
	var that;
	var _offsetX, 
		_offsetY,
		_parent,
		_position, 
		_state;

	var _coordinates = {
		UP: 0,
		DOWN: 1,
		LEFT: 2,
		RIGHT: 3
	};

	var _action = {
		MOVING: 0,
		FLOATING: 1,
		JUMPING:2
	};

	function setParent(p) {
		_parent = p;
		_offsetX = that.getX() - _parent.getX();
		_offsetY = that.getY() - _parent.getY();
	};
	that = actor(x, y, width, height, false, 'red', 'player');
	setParent(parent);
	_position = _coordinates.UP;
	_floating = false;
	_state = _action.MOVING;;

	that.update = function(dt) {
		var dx,
			previousPos;

		dx = Math.round(speed * dt);
		switch(_state) {
			case _action.MOVING:
				if(_position === _coordinates.UP || _position === _coordinates.DOWN) {
					_offsetX += dx;
					that.setX(_offsetX + parent.getX());
					if(_position === _coordinates.UP) {
						that.setY(parent.getY() - that.getHeight());
					}
					else {
						that.setY(parent.getY() + parent.getHeight());
					}
				}
				else {
					_offsetY += dx;
					that.setY(_offsetY + parent.getY());
					if(_position === _coordinates.LEFT) {
						that.setX(parent.getX() - that.getWidth());
					}
					else {
						that.setX(parent.getX() + parent.getWidth());
					}
				}

				if(speed > 0 && 
					(_offsetX >= _parent.getWidth() && (_position === _coordinates.UP || _position === _coordinates.DOWN) 
					|| _offsetY >= _parent.getHeight() && (_position === _coordinates.LEFT || _position === _coordinates.RIGHT))
				|| speed < 0 && 
					(_offsetX <= - that.getWidth() && (_position === _coordinates.UP || _position === _coordinates.DOWN)
					|| _offsetY <= - that.getHeight() && (_position === _coordinates.LEFT || _position === _coordinates.RIGHT))) {
					_state = _action.FLOATING;
				}

			break;

			case _action.FLOATING:
				console.log('flotando: ' + _position + ', ' + speed);
				previousPos = _position;
				if(_position === _coordinates.UP || _position === _coordinates.DOWN) {
					if(speed > 0) {
						_position = _coordinates.RIGHT;
						that.move(-(_offsetX - _parent.getWidth()), 0);
					}
					else {
						_position = _coordinates.LEFT;
						that.move(-that.getWidth() - _offsetX, 0);
					}
				}
				else {
					if(speed > 0) {
						_position = _coordinates.DOWN;
						that.move(0, -(_offsetY - _parent.getHeight()));
					}
					else {
						_position = _coordinates.UP;
						that.move(0, -that.getHeight() - _offsetY);
					}
				}
				if((previousPos === _coordinates.UP || previousPos === _coordinates.LEFT) && speed <0
					|| (previousPos === _coordinates.DOWN || previousPos === _coordinates.RIGHT) && speed >0) {
					speed = speed * -1;
				}
				_state = _action.MOVING;	
			break;
		}
	};

	return that;
}

