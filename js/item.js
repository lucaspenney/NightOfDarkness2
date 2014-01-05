function Item(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.pickedUp = false;
	this.sprite = new Sprite("images/items.png");
	switch (type) {
		case 'healthpack':
			{
				this.sprite.xOffset = 48;
				break;
			}
		case 'ammopack':
			{
				this.sprite.xOffset = 32;
				break;
			}
		case 'batterypack':
			{
				this.sprite.xOffset = 16;
				break;
			}
		case 'flashlight':
			{
				this.sprite.xOffset = 0;
				break;
			}
	}
	this.boundingBox = new BoundingBox(this.x, this.y, 10, 10);
	this.dropTime = 0;
	Game.entities.push(this);
}

Item.prototype.use = function() {
	if (this.type === 'ammopack' && Game.player.gun === null) return;
	if (this.type === 'batterypack' && Game.player.battery > 96) return;
	switch (this.type) {
		case 'healthpack':
			{
				Game.player.health += 25;
				if (Game.player.health > 100) Game.player.health = 100;
				break;
			}
		case 'ammopack':
			{
				if (Game.player.gun instanceof Gun) Game.player.gun.ammo += Game.player.gun.clipSize * 4;
				break;
			}
		case 'batterypack':
			{
				Game.player.batteryPower += 50;
				if (Game.player.batteryPower > 100) Game.player.batteryPower = 100;
				break;
			}
		case 'flashlight':
			{
				Game.player.hasFlashlight = true;
				break;
			}
	}
};

Item.prototype.pickUp = function() {
	if (Game.player.inventory.addItem(this)) {
		this.pickedUp = true;
	}
};

Item.prototype.render = function() {
	if (!this.pickedUp) {
		this.sprite.renderOnScreen(this.x, this.y);
	}
};

Item.prototype.update = function() {
	if (!this.pickedUp) {
		if (this.boundingBox.isColliding(Game.player)) {
			this.pickUp();
		}
	}
	this.boundingBox.update(this.x, this.y);
};