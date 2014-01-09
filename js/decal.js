function Decal(x, y, image) {
	this.x = x;
	this.y = y;
	this.layer = -1;
	this.sprite = new Sprite(image, true);
	this.sprite.rotation = Math.floor(Math.random() * 359);
	this.lifeTime = 0;
	Game.entities.push(this);
}

Decal.prototype.render = function() {
	this.sprite.renderOnScreen(this.x, this.y);
};

Decal.prototype.update = function() {
	this.lifeTime++;
	if (this.lifeTime > 300) this.sprite.fadeOut();
};