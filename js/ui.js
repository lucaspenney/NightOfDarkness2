function UI() {
	this.alert = "";
	this.gameOver = false;
	this.gameOverImg = new Image();
	this.gameOverImg.src = "images/gameover2.png";
}

UI.prototype.draw = function() {
	ctx.textAlign = 'center';

	ctx.fillStyle = "#F00";
	ctx.font = 'normal 20px arial';
	//ctx.fillText(this.alert, canvas.width/2,canvas.height/4);
	if (this.gameOver) ctx.drawImage(this.gameOverImg, (canvas.width / 2) - this.gameOverImg.width / 2, canvas.height / 4);

	this.drawStats(3, 15);

	this.drawGun(375, 430);

	this.drawHealth(50, 420);

	this.drawBattery(170, 420);

};

UI.prototype.drawLoadingScreen = function() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//ctx.fillText(this.alert, canvas.width/2,canvas.height/4);
	ctx.textAlign = 'center';
	ctx.fillStyle = "#FFF";
	ctx.font = 'normal 20px arial';
	ctx.fillText("Loading...", canvas.width / 2, canvas.height / 4);
	ctx.fillRect(100, canvas.height / 3, Game.loader.getLoadPercent() * 3, 30);
	ctx.fillText(Math.floor(Game.loader.getLoadPercent()) + "%", canvas.width / 2, canvas.height / 2);
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
	ctx.textAlign = 'left';
	ctx.font = 'normal 16px arial';
	ctx.fillText("Health", x, y - 5);
	ctx.strokeStyle = "#666";
	ctx.lineWidth = 1;
	ctx.strokeRect(x, y, 106, 26);
	ctx.fillStyle = "#0C0";
	ctx.fillRect(x + 3, y + 3, Game.player.health, 20);
	ctx.fillStyle = 'rgba(' + 255 + ',' + 0 + ',' + 0 + ',' + (1 - (Game.player.health / 100)) + ');';
	ctx.fillRect(x + 3, y + 3, Game.player.health, 20);
};

UI.prototype.drawGun = function(x, y) {
	ctx.textAlign = 'left';
	ctx.font = 'normal 18pt Calibri';
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
	ctx.fillText(gunname + " " + gunclipammo + "/" + gunammo, x + 0, y + 10);
};
UI.prototype.handleInput = function() {
	//Onclick handler

};