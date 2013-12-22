//point.js

function Point(x,y) {
	this.x = x;
	this.y = y;
}

Point.prototype.getDist = function(point) {
	var xs = 0;
	var ys = 0;

	xs = point.x - this.x;
	xs = xs * xs;

	ys = point.y - this.y;
	ys = ys * ys;

	return Math.sqrt( xs + ys );
};
