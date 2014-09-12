var actor = function(x, y, width, height, color, isStatic) {
	var _x, 
		_y,
		_w,
		_h,
		_color
		_static;

	_x = x || 0;
	_y = y || 0;
	_w = width || 0;
	_h = height || 0;
	_color = color || 'rgb(255, 255, 255)';
	_static = isStatic || false;

	return {
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
		}
	}
};