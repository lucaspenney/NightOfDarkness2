function Item(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.pickedUp = false;
	this.owner = null;
	this.sprite = new Sprite("images/items.png");
	this.placementSprite = new Sprite("images/barricade_placed.png");
	this.placementSprite.xOffset = 0;
	this.placementSprite.frameWidth = 32;
	this.placementSprite.frameHeight = 32;
	this.placementSprite.alpha = 0.3;
	this.placementBox = new BoundingBox(this.x - 16, this.y - 16, 32, 32);
	this.useTime = 1;
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
		case 'barricade':
			{
				this.sprite.xOffset = 64;
				this.useTime = 2;
				break;
			}
	}
	this.boundingBox = new BoundingBox(this.x, this.y, 10, 10);
	this.dropTime = 0;
	this.useStartTime = 0;
	this.consumed = false;
	Game.entities.push(this);
}

Item.prototype.use = function() {
	if (this.type === 'barricade') {
		if (!this.canPlace()) return;
	}
	if (this.useStartTime === 0) this.useStartTime = getCurrentMs();
	if (this.useStartTime - getCurrentMs() < -this.useTime) {
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
			case 'barricade':
				{
					//TODO: Add check to see if it's a valid place to put the barricade
					new Barricade(this.owner.x, this.owner.y);
					break;
				}
		}
		this.consumed = true;
		Game.input.mouse.down = false;
	}
};

Item.prototype.pickUp = function(owner) {
	if (this.dropTime - getCurrentMs() < -1 && !this.pickedUp) {
		if (owner.inventory.addItem(this)) {
			this.owner = owner;
			this.pickedUp = true;
		}
	}
};

Item.prototype.render = function() {
	if (!this.pickedUp) {
		this.sprite.renderOnScreen(this.x, this.y);
	}
	//Draw use progress bar
	if (this.useStartTime !== 0) {
		var amount = (getCurrentMs() - this.useStartTime) * 10;
		ctx.fillStyle = "#0C0";
		ctx.fillRect(this.owner.x + Game.screen.xOffset - (this.useTime * 5) - 1, this.owner.y + Game.screen.yOffset + 10, amount, 4);
	}
	if (this.type === 'barricade' && this.owner !== null) {
		if (this.owner.getCurrentEquip() === this) {
			if (!this.canPlace()) {
				this.useStartTime = 0;
				return;
			}
			var target = new Point(Game.input.mouse.x - Game.screen.xOffset, Game.input.mouse.y - Game.screen.yOffset);
			var x = (target.x - this.owner.x) * 33;
			var y = (target.y - this.owner.y) * 33;
			x /= target.getDist(new Point(this.owner.x, this.owner.y));
			y /= target.getDist(new Point(this.owner.x, this.owner.y));
			this.placementSprite.renderOnScreen(this.owner.x + x, this.owner.y + y);
		}
	}
};

Item.prototype.canPlace = function() {
	var target = new Point(Game.input.mouse.x - Game.screen.xOffset, Game.input.mouse.y - Game.screen.yOffset);
	var x = (target.x - this.owner.x) * 33;
	var y = (target.y - this.owner.y) * 33;
	x /= target.getDist(new Point(this.owner.x, this.owner.y));
	y /= target.getDist(new Point(this.owner.x, this.owner.y));
	this.placementBox.x = this.owner.x + x - 16;
	this.placementBox.y = this.owner.y + y - 16;
	var xpos = Math.floor((this.owner.x / 32)) - 2;
	var ypos = Math.floor((this.owner.y / 32)) - 2;
	if (xpos < 0) xpos = 0;
	if (xpos > Game.level.width - 4) xpos = Game.level.width - 4;
	if (ypos < 0) ypos = 0;
	if (ypos > Game.level.height - 4) ypos = Game.level.height - 4;
	for (var y = ypos; y < ypos + 4; y++) {
		for (var x = xpos; x < xpos + 4; x++) {
			if (Game.level.tiles[x][y].solid) {
				if (this.placementBox.isColliding(Game.level.tiles[x][y])) {
					return false;
				}
			}
		}
	}
	return true;
};

Item.prototype.update = function() {
	if (!this.pickedUp) {
		if (this.boundingBox.isColliding(Game.player)) {
			this.pickUp(Game.player);
		}
	}
	if (!Game.input.mouse.down) {
		this.useStartTime = 0;
	}
	this.boundingBox.update(this.x, this.y);
};

Item.prototype.drop = function() {
	this.x = Game.player.x + (Math.random() * 10) - 10;
	this.y = Game.player.y + (Math.random() * 10) - 10;
	this.pickedUp = false;
	this.sprite.scale = 1;
	this.dropTime = getCurrentMs();
	Game.sound.playGunSound(Game.sound.guns.drop);
};