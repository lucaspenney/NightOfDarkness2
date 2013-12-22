function Screen() {
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 600;
	this.height = 450;
	this.maxXOffset = Game.level.width * 32 * -1;
	this.maxYOffset = Game.level.height * 32 * -1;
}

Screen.prototype.scroll = function() {
	this.move(0, 0);
};

Screen.prototype.move = function(x, y) {
	if (x < 0) {
		if (this.xOffset + x > this.maxXOffset + this.width) {
			this.xOffset += x;
		}
	} else if (x > 0) {
		if (this.xOffset + x < 0) {
			this.xOffset += x;
		}
	}
	if (y < 0) {
		if (this.yOffset + y > this.maxYOffset + this.height) {
			this.yOffset += y;
		}
	} else if (y > 0) {
		if (this.yOffset + y < 0) {
			this.yOffset += y;
		}
	}
};

Screen.prototype.setOffset = function(x, y) {
	if (x > this.maxXOffset) x = this.maxXOffset;
	if (y > this.maxYOffset) y = this.maxYOffset;
	if (x > 0) x = 0;
	if (y > 0) y = 0;
	this.xOffset = x;
	this.yOffset = y;
};