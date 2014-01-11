//player.js

function Player() {
	Game.entities.push(this);
	this.x = 900;
	this.y = 900;
	this.health = 100;
	this.rotation = 0;
	this.lastUpdate = 0;
	this.sprite = new Sprite("images/player.png");
	this.width = 18;
	this.height = 18;
	this.scale = 1;
	this.rotation = 180;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
	this.layer = 4;
	this.gun = null;
	this.lastGunDrop = 0;
	this.hasFlashlight = true;
	this.lastHealthRegen = 0;
	this.flashlight = true;
	this.lastFlashlightToggle = 0;
	this.batteryPower = 100;
	this.kills = 0;
	this.gameTime = 0;
	this.inventory = new Inventory();
}

Player.prototype.update = function() {
	this.boundingBox.update(this.x + (this.width / 2) - 18, this.y + (this.height / 2) - 18);
	if (Game.input.mouse.down) this.use();
	if ((this.lastUpdate - getCurrentMs()) < -0.65) {
		if (this.flashlight) {
			this.batteryPower -= 1;
			if (this.batteryPower <= 0) {
				this.batteryPower = 0;
				this.flashlight = false;
			}
			this.lastUpdate = getCurrentMs();
		}
	}
	if ((this.lastHealthRegen - getCurrentMs()) < -2) {
		this.health++;
		if (this.health > 100) this.health = 100;
		this.lastHealthRegen = getCurrentMs();
	}
};

Player.prototype.render = function() {
	this.rotation = Math.atan2(this.y + Game.screen.yOffset - (this.height / 2) - Game.input.mouse.y, this.x + Game.screen.xOffset - (this.width / 2) - Game.input.mouse.x) * (180 / Math.PI);
	if (this.rotation < 0) {
		this.rotation += 360;
	}
	this.rotation -= 90;
	this.sprite.rotation = this.rotation;
	if (this.sprite.rotation > -30 && this.sprite.rotation < 90) {
		this.sprite.rotation -= 5;
	}
	this.sprite.renderOnScreen(this.x, this.y);

	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 2, 2);

	if (this.getCurrentEquip() instanceof Gun) {
		if (!this.getCurrentEquip().reloading) {
			this.sprite.xOffset = 16;
		} else this.sprite.xOffset = 0;
	}

	if (this.x > 300 && this.x + 300 < Game.screen.maxXOffset * -1) Game.screen.xOffset = -(this.x - 300);
	if (this.y > 225 && this.y + 225 < Game.screen.maxYOffset * -1) Game.screen.yOffset = -(this.y - 225);

	if (Game.screen.xOffset > 0) Game.screen.xOffset = 0;
	if (Game.screen.yOffset > 0) Game.screen.yOffset = 0;
};

Player.prototype.fire = function() {
	if (this.gun !== null) {
		if (new Point(this.x, this.y).getDist(new Point(Game.input.mouse.x - Game.screen.xOffset - Game.screen.xOffset, Game.input.mouse.y - Game.screen.yOffset - Game.screen.yOffset)) > 30) {
			this.gun.fire();
		}
	}
};

Player.prototype.reloadWeapon = function() {
	if (this.getCurrentEquip() instanceof Gun) {
		if (this.getCurrentEquip().ammo > 0)
			this.getCurrentEquip().reloadGun();
	}
};

Player.prototype.toggleFlashlight = function() {
	if (this.hasFlashlight) {
		if ((this.lastFlashlightToggle - getCurrentMs()) < -0.2) {
			if (this.flashlight) this.flashlight = false;
			else if (this.batteryPower > 0) this.flashlight = true;
			this.lastFlashlightToggle = getCurrentMs();
		}
	} else this.flashlight = false;
};

Player.prototype.takeDamage = function(amount) {
	Game.sound.playHurtSound();
	Game.particles.createBloodParticles(this.x, this.y);
	this.health -= amount;
	if (this.health <= 0) {
		this.health = 0;
		Game.gameOver();
	}
};

Player.prototype.drop = function() {
	if (this.getCurrentEquip() !== null) {
		if ((this.lastGunDrop - getCurrentMs()) < -0.6) {
			this.getCurrentEquip().drop();
			this.inventory.removeItem(this.getCurrentEquip());
			this.lastGunDrop = getCurrentMs();
		}
	}
};


Player.prototype.interact = function() {
	//Interact with the environment
};

Player.prototype.use = function() {
	//Use current inventory item
	if (this.getCurrentEquip() instanceof Gun) {
		this.inventory.items[this.inventory.selectedItem].fire();
	} else {
		this.inventory.useItem(this.inventory.selectedItem);
	}
};

Player.prototype.getCurrentEquip = function() {
	return this.inventory.items[this.inventory.selectedItem];
};

Player.prototype.move = function(xm, ym) {
	if (!Game.inGame) return;
	if (this.getCurrentEquip() instanceof Item) {
		if (this.getCurrentEquip().useStartTime !== 0) return;
	}
	xm *= 1;
	ym *= 1;

	var canMove = true;
	for (var x = 0; x < Game.level.width; x++) {
		for (var y = 0; y < Game.level.height; y++) {
			if (Game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(xm, ym, Game.level.tiles[x][y])) {
					canMove = false;
				}
			}
		}
	}
	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] instanceof Zombie) {
			if (this.boundingBox.wouldCollide(xm, ym, Game.entities[i])) {
				canMove = false;
			}
		}
	}
	if (canMove) {
		this.x += xm;
		this.y += ym;
	}
};