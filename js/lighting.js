var lightingCanvas = document.createElement('canvas');

function LightingManager() {
	var _this = this;
	$(document).ready(function() {
		lightingCanvas.width = 600;
		lightingCanvas.height = 450;
		_this.ctx = lightingCanvas.getContext('2d');
	});
	this.ctx = lightingCanvas.getContext('2d');
	this.fullbright = false;
	this.filter = null;
	this.flashlightSprite = new Sprite("images/flashlight.png");
}

LightingManager.prototype.render = function() {
	if (this.ctx === null || this.ctx === undefined) return;

	this.ctx.save();
	this.ctx.fillStyle = "#000";
	this.ctx.fillRect(0, 0, lightingCanvas.width, lightingCanvas.height);
	this.ctx.fill();


	this.ctx.globalCompositeOperation = 'destination-out';
	var radgrad = this.ctx.createRadialGradient(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 20, Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 300);
	if (Game.player.flashlight) {
		radgrad.addColorStop(0, "rgba(0, 0, 0, 1)");
		radgrad.addColorStop(0.1, "rgba(0, 0, 0, 0.3)");
		radgrad.addColorStop(0.32, "rgba(0, 0, 0, 0.1)");
		radgrad.addColorStop(0.4, "rgba(0, 0, 0, 0.03)");
		radgrad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
	} else {
		radgrad.addColorStop(0, "rgba(0, 0, 0, 1)");
		radgrad.addColorStop(0.1, "rgba(0, 0, 0, 0.3)");
		radgrad.addColorStop(0.2, "rgba(0, 0, 0, 0.1)");
		radgrad.addColorStop(0.3, "rgba(0, 0, 0, 0)");
	}
	this.ctx.fillStyle = radgrad;
	this.ctx.beginPath();
	this.ctx.arc(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 300, 0, 2 * Math.PI, false);
	this.ctx.fill();

	if (Game.player.flashlight) {
		this.ctx.save();
		this.ctx.translate(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset);
		this.ctx.rotate(degToRad(Game.player.rotation + 180));
		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.drawImage(this.flashlightSprite.img, -40, 0, this.flashlightSprite.img.width, this.flashlightSprite.img.height);
		this.ctx.restore();
	}

	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] instanceof Light) {
			Game.entities[i].render(this.ctx);
			Game.entities[i].update();
		}
	}
	ctx.drawImage(lightingCanvas, 0, 0);
	this.ctx.restore();
};