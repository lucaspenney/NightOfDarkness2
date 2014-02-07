function Barricade(x, y) {
	//Deployed barricade is created from barricade Item
	this.x = x;
	this.y = y;
	this.layer = 4;
	var target = new Point(Game.input.mouse.x - Game.screen.xOffset, Game.input.mouse.y - Game.screen.yOffset);
	this.xv = (target.x - this.x) * 33;
	this.yv = (target.y - this.y) * 33;
	this.xv /= target.getDist(new Point(this.x, this.y));
	this.yv /= target.getDist(new Point(this.x, this.y));
	this.x += this.xv;
	this.y += this.yv;
	this.health = 150;
	this.maxHealth = 150;
	this.sprite = new Sprite("images/barricade_placed.png", false);
	this.sprite.xOffset = 0;
	this.sprite.frameWidth = 32;
	this.sprite.frameHeight = 32;
	this.boundingBox = new BoundingBox(this.x - 16, this.y - 16, 30, 30);
	Game.entities.push(this);
}

Barricade.prototype.update = function() {
	if ((this.health / this.maxHealth) * 100 < 66) {
		this.sprite.xOffset = 32;
	}
	if ((this.health / this.maxHealth) * 100 < 34) {
		this.sprite.xOffset = 64;
	}
	if (this.health <= 0) {
		this.sprite.xOffset = 96;
		if (getCurrentMs() - this.deathTime > 10) {
			Game.deleteEntity(this);
		}
	}
};

Barricade.prototype.render = function() {
	this.sprite.renderOnScreen(this.x, this.y);
};

Barricade.prototype.takeDamage = function(amount) {
	this.health -= amount;
	if (this.health <= 0) {
		this.deathTime = getCurrentMs();
		this.layer = 1;
		this.boundingBox.x = 0;
		this.boundingBox.y = 0;
		//Game.deleteEntity(this);
	}
};