function UI() {
	this.gameOverSprite = new Sprite("images/gameover.png", true);
	this.hudImg = new Image();
	this.hudImg.src = "images/hud.png";
	this.loadingPercent = 0;
	this.flashlightSprite = new Sprite("images/flashlight_large.png", true);
	this.inventorySelectedSprite = new Sprite("images/inventory_selected.png", true);
}

UI.prototype.draw = function() {
	ctx.textAlign = 'center';
	ctx.fillStyle = "#F00";
	ctx.font = 'normal 20px arial';
	if (Game.playerDead)
		this.gameOverSprite.drawImage(Game.width / 2, Game.height / 3);

	ctx.drawImage(this.hudImg, 0, 0);

	this.drawStats(3, 15);

	this.drawGun(460, 435);

	this.drawHealth(211, 430);

	this.drawFlashlight(10, 370);

	this.drawInventory(20, 430);
};

UI.prototype.drawLoadingScreen = function() {
	this.loadingPercent += (Game.loader.getLoadPercent() - this.loadingPercent) * 0.1;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, Game.width, Game.height);
	ctx.textAlign = 'center';
	ctx.fillStyle = "#FFF";
	ctx.font = 'normal 20px arial';
	ctx.fillText("Loading...", Game.width / 2, Game.height / 4);
	ctx.fillRect(100, Game.height / 3, this.loadingPercent * 4, 30);
	ctx.fillText(Math.floor(Game.loader.getLoadPercent()) + "%", Game.width / 2, Game.height / 2);
};

UI.prototype.drawStats = function(x, y) {
	ctx.textAlign = 'left';
	ctx.fillStyle = "#FFF";
	ctx.font = 'normal 18px Georgia';

	if (Game.level.waves.waitTime > 0) {
		ctx.textAlign = 'center';
		ctx.fillText("Wave " + (Game.level.waves.currentWave + 1), Game.width / 2, Game.height / 5);
	}
};

UI.prototype.drawFlashlight = function(x, y) {
	this.flashlightSprite.frameWidth = 16;
	if (Game.player.flashlight) this.flashlightSprite.xOffset = 16;
	else this.flashlightSprite.xOffset = 0;
	this.flashlightSprite.drawImage(x, y);

	ctx.strokeStyle = "#333";
	ctx.strokeRect(x + 15, y - 2, 8, 35);
	var powerVal = Math.floor(Game.player.batteryPower / 3);
	ctx.fillStyle = "#0C0";
	ctx.fillRect(x + 16, y + 32 - powerVal, 6, powerVal);
};

UI.prototype.drawHealth = function(x, y) {
	var r = 0,
		g = 0,
		b = 0;
	if (Game.player.health > 80) g = 150;
	else if (Game.player.health > 50) g = 120;
	else if (Game.player.health > 30) r = 180;
	else if (Game.player.health > 20) r = 100;
	ctx.strokeStyle = "#333";
	ctx.strokeRect(x, y, 242, 10);

	ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + '1' + ')';
	ctx.fillRect(x + 1, y + 1, Math.floor(Game.player.health * 2.4), 8);
};

UI.prototype.drawInventory = function(x, y) {
	for (var i = 1; i < Game.player.inventory.items.length; i++) {
		if (Game.player.inventory.selectedItem === i) {
			this.inventorySelectedSprite.drawImage(x - 2, y + 3);
		}
		Game.player.inventory.items[i].sprite.drawImage(x - 1, y + 2);
		x += 30;
	}
};

UI.prototype.drawGun = function(x, y) {
	ctx.textAlign = 'center';
	ctx.font = 'normal 10pt Courier New';
	ctx.fillStyle = "#FFF";

	var gunname;
	var gunammo;
	var gunclipammo;
	var gunclipmax;
	if (Game.player.getCurrentEquip() instanceof Gun) {
		gunname = Game.player.getCurrentEquip().displayName;
		gunammo = Game.player.getCurrentEquip().ammo;
		gunclipammo = Game.player.getCurrentEquip().clipAmmo;
		gunclipmax = Game.player.getCurrentEquip().clipSize;
	} else if (Game.player.getCurrentEquip() instanceof Item) {
		//
		gunname = Game.player.getCurrentEquip().displayName;
		gunammo = 1;
		gunclipammo = 1;
		gunclipmax = 1;
	} else {
		gunname = "Unarmed";
		gunammo = 0;
		gunclipammo = 0;
		gunclipmax = 0;
	}
	ctx.fillText(gunname, x + 75, y + 5);
	ctx.fillText(gunclipammo + "/" + gunammo, x + 110, y - 10);

	try {
		Game.player.getCurrentEquip().sprite.scale = 2;
		Game.player.getCurrentEquip().sprite.drawImage(x + 50, y - 30);
		Game.player.getCurrentEquip().sprite.scale = 1;
	} catch (e) {}
};

UI.prototype.handleInput = function() {
	//Onclick handler

};