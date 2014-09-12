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
			dx = Math.floor(vx*dt);
			dy = Math.floor(vy*dt);
		}
		else {
			dx = Math.ceil(vx*dt);
			dy = Math.ceil(vy*dt);
		}
		that.move(dx, dx);
		if(that.getX() < x && vx < 0 || that.getX() >= xf && vx >0) {
			vx = vx * - 1;
			vy = vy * - 1;
		}
	}

	return that;
}
