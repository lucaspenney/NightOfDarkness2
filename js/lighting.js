var flashlightImg = new Image();
flashlightImg.src = "images/flashlight.png";

function drawLights() {
	can2.width = 600;
	can2.height = 450;
	ctx2.save();
	ctx.fillStyle = "#000";
	var radgrad = ctx2.createRadialGradient(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 20, Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 600);
	if (Game.player.flashlight) {
		radgrad.addColorStop(0, "rgba(0, 0, 0, 0.1)");
		radgrad.addColorStop(0.1, "rgba(0, 0, 0, 0.7)");
		radgrad.addColorStop(0.32, "rgba(0, 0, 0, 1)");
	} else {
		radgrad.addColorStop(0, "rgba(0,0,0,0.2)");
		radgrad.addColorStop(0.05, "rgba(0,0,0,0.75)");
		radgrad.addColorStop(0.19, "rgba(0, 0, 0, 1)");
	}
	ctx2.fillStyle = radgrad;
	ctx2.beginPath();
	ctx2.arc(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 650, 0, 2 * Math.PI, false);
	ctx2.fill();
	ctx2.globalCompositeOperation = 'destination-out';
	if (Game.player.flashlight) {
		ctx2.save();
		ctx2.translate(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset);
		ctx2.rotate(degToRad(Game.player.rotation + 180));
		ctx2.drawImage(flashlightImg, -40, 0, flashlightImg.width, flashlightImg.height);
		ctx2.restore();
	}
	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] instanceof Light) {
			Game.entities[i].render();
			Game.entities[i].update();
		}
	}
	//ctx2.fillRect(50,50,100,100); //TODO: Draw other lights in here. 
}