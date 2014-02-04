function Flare(x, y) {
	this.x = x;
	this.y = y;
	this.layer = 0;
	this.sprite = new Sprite("images/flare.png", true);
	new Light(this.x - 16, this.y - 16);
	Game.entities.push(this);
}

Flare.prototype.render = function() {
	this.sprite.renderOnScreen(this.x, this.y);
};

Flare.prototype.update = function() {

};

function Light(x, y) {
	this.x = x;
	this.y = y;
	Game.entities.push(this);
}

Light.prototype.render = function(ctx2) {
	//Canvas 2 - cut a hole in the darkness with a gradient
	if (ctx2 === undefined) return;
	ctx2.save();
	var radgrad2 = ctx2.createRadialGradient(this.x + Game.screen.xOffset + 16, this.y + Game.screen.yOffset + 16, 20, this.x + Game.screen.xOffset + 16, this.y + Game.screen.yOffset + 16, 70);
	// radgrad2.addColorStop(0.1, "rgba(150, 20, 0, 0.1)");
	radgrad2.addColorStop(0.1, "rgba(150, 0, 0, 0.65)");
	radgrad2.addColorStop(0.8, "rgba(0, 0, 0, 0)");
	ctx2.fillStyle = radgrad2;
	ctx2.beginPath();
	ctx2.arc(this.x + Game.screen.xOffset + 16, this.y + Game.screen.yOffset + 16, 70, 0, 2 * Math.PI, false);
	ctx2.fill();
	ctx2.restore();
};

Light.prototype.update = function() {

};