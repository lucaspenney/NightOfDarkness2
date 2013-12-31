function Sprite(img) {
	this.img = new Image();
	this.img.src = img;
	this.scale = 1;
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 1;
	this.height = 1;
	this.rotation = 0;
	this.frameWidth = 16;
	this.frameHeight = 16;
	this.loaded = false;
	this.rotation = 0;
	this.alpha = 1;
	this.fadeAmount = 0;
	var _this = this;
	this.img.onload = function() {
		_this.loaded = true;
		_this.width = _this.img.width;
		_this.height = _this.img.height;
	};
}

Sprite.prototype.render = function(x, y) {
	ctx.drawImage(this.img, this.xOffset, this.yOffset, this.width, this.height, x, y, this.width * this.scale, this.width * this.scale);
};
Sprite.prototype.renderOnScreen = function(x, y) {
	if (!this.loaded) return;
	//Check if the entity is on Game.screen, and draw if so
	if (x + Game.screen.xOffset < Game.screen.width && x + Game.screen.xOffset > 0) {
		if (y + Game.screen.yOffset < Game.screen.height && y + Game.screen.yOffset > 0) {
			this.drawImage(x + Game.screen.xOffset, y + Game.screen.yOffset);
		}
	}
};

Sprite.prototype.drawImage = function(x, y) {
	if (this.fadeAmount !== 0) {
		this.alpha += this.fadeAmount;
		if (this.alpha >= 1) {
			this.fadeAmount = 0;
			if (this.onFadeIn !== undefined) this.onFadeIn();
			this.alpha = 1;
		}
		if (this.alpha <= 0) {
			this.fadeAmount = 0;
			if (this.onFadeOut !== undefined) this.onFadeOut();
			this.alpha = 0;
		}
	}
	if (this.rotation === 0) {
		ctx.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, x, y, this.frameWidth * this.scale, this.frameWidth * this.scale);
	} else {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(degToRad(this.rotation));
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth * this.scale, this.frameWidth * this.scale);
		ctx.restore();
	}
};

Sprite.prototype.fadeOut = function(callback) {
	this.onFadeOut = callback;
	this.fadeAmount = -0.05;
};

Sprite.prototype.fadeIn = function(callback) {
	this.onFadeIn = callback;
	this.fadeAmount = 0.05;
};