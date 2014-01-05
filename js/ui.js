function UI() {
	this.alert = "";
	this.gameOver = false;
	this.gameOverImg = new Image();
	this.gameOverImg.src = "images/gameover2.png";
	this.hudImg = new Image();
	this.hudImg.src = "images/hud.png";
	this.loadingPercent = 0;
}

UI.prototype.draw = function() {
	ctx.textAlign = 'center';

	ctx.fillStyle = "#F00";
	ctx.font = 'normal 20px arial';
	//ctx.fillText(this.alert, canvas.width/2,canvas.height/4);
	if (this.gameOver) ctx.drawImage(this.gameOverImg, (canvas.width / 2) - this.gameOverImg.width / 2, canvas.height / 4);


	ctx.drawImage(this.hudImg, 0, 0);

	this.drawStats(3, 15);

	this.drawGun(460, 435);

	this.drawHealth(210, 440);

	//this.drawBattery(170, 420);

	this.drawInventory();
};

UI.prototype.drawLoadingScreen = function() {
	this.loadingPercent += (Game.loader.getLoadPercent() - this.loadingPercent) * 0.1;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//ctx.fillText(this.alert, canvas.width/2,canvas.height/4);
	ctx.textAlign = 'center';
	ctx.fillStyle = "#FFF";
	ctx.font = 'normal 20px arial';
	ctx.fillText("Loading...", canvas.width / 4, canvas.height / 8);
	ctx.fillRect(100, canvas.height / 6, this.loadingPercent * 4, 30);
	ctx.fillText(Math.floor(Game.loader.getLoadPercent()) + "%", canvas.width / 4, canvas.height / 4);
};

UI.prototype.drawStats = function(x, y) {
	ctx.textAlign = 'left';
	ctx.font = 'normal 16px arial';
	ctx.fillStyle = "#FFF";
	ctx.fillText("Kills: " + Game.player.kills, x, y);
	ctx.fillText("Time: " + Game.level.levelTime, x, y + 20);
};

UI.prototype.drawBattery = function(x, y) {
	ctx.textAlign = 'left';
	ctx.font = 'normal 16px arial';
	ctx.strokeStyle = "#666";
	ctx.lineWidth = 1;
	ctx.strokeRect(x, y, 96, 26);
	ctx.fillStyle = "#0C0";
	//ctx.fillRect(x+2,y+2,player.batteryPower,20);
	for (var i = 0; i < Game.player.batteryPower / 10; i++) {
		ctx.fillRect(x + 3 + (i * 9), y + 3, 8, 20);
	}
	ctx.fillStyle = "#FFF";
	ctx.fillText("Flashlight", x, y - 5);
};

UI.prototype.drawHealth = function(x, y) {
	var r = (255 - Game.player.health) * 2,
		g = Game.player.health * 2,
		b = 0;
	if (Game.player.health < 75) {
		g = Math.floor(g /= 4);
	} else r = Math.floor(r /= 4);
	ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + '1' + ')';
	ctx.fillRect(x, y, Math.floor(Game.player.health * 1.7), 15);
};

UI.prototype.drawInventory = function() {
	var x = 25,
		y = 420;
	for (var i = 0; i < Game.player.inventory.items.length; i++) {
		Game.player.inventory.items[i].sprite.scale = 1.5;
		Game.player.inventory.items[i].sprite.drawImage(x, y);
		x += 45;
	}
};

UI.prototype.drawGun = function(x, y) {
	ctx.textAlign = 'left';
	ctx.font = 'normal 16pt Calibri';
	ctx.fillStyle = "#FFF";

	var gunname;
	var gunammo;
	var gunclipammo;
	var gunclipmax;
	if (Game.player.gun !== null) {
		gunname = Game.player.gun.displayName;
		gunammo = Game.player.gun.ammo;
		gunclipammo = Game.player.gun.clipAmmo;
		gunclipmax = Game.player.gun.clipSize;
	} else {
		gunname = "Unarmed";
		gunammo = 0;
		gunclipammo = 0;
		gunclipmax = 0;
	}
	ctx.fillText(gunname, x + 10, y + 10);
	ctx.fillText(gunclipammo + "/" + gunammo, x + 50, y - 40);

	try {
		Game.player.gun.sprite.scale = 2;
		Game.player.gun.sprite.drawImage(x + 50, y - 25);
		Game.player.gun.sprite.scale = 1;
	} catch (e) {}
};

UI.prototype.handleInput = function() {
	//Onclick handler

};