function Barricade(x, y) {
	//Deployed barricade is created from barricade Item
	this.x = x;
	this.y = y;
	var target = new Point(Game.input.mouse.x - Game.screen.xOffset, Game.input.mouse.y - Game.screen.yOffset);
	this.xv = (target.x - this.x) * 35;
	this.yv = (target.y - this.y) * 35;
	this.xv /= target.getDist(new Point(this.x, this.y));
	this.yv /= target.getDist(new Point(this.x, this.y));
	this.x += this.xv;
	this.y += this.yv;
	this.health = 50;
	this.sprite = new Sprite("images/barricade_placed.png", true);
	this.boundingBox = new BoundingBox(this.x - 16, this.y - 16, 30, 30);
	Game.entities.push(this);
}

Barricade.prototype.update = function() {

};

Barricade.prototype.render = function() {
	this.sprite.renderOnScreen(this.x, this.y);
};

Barricade.prototype.takeDamage = function(amount) {
	this.health -= amount;
	if (this.health <= 0) {
		Game.deleteEntity(this);
	}
};