//input.js


function InputManager() {
	this.mouse = new Mouse();
	this.keys = [];
}

function Mouse() {
	this.x = 0;
	this.y = 0;
	this.down = false;
}

InputManager.prototype.handleInteractions = function() {
	if (Game.player === null) return;
	if (this.keys[38] || this.keys[87]) { //Up arrow
		Game.player.move(0, -2);
	}
	if (this.keys[37] || this.keys[65]) { //Left Arrow
		Game.player.move(-2, 0);
	}
	if (this.keys[39] || this.keys[68]) { //right arrow
		Game.player.move(2, 0);
	}
	if (this.keys[40] || this.keys[83]) { //down arrow
		Game.player.move(0, 2);
	}
	if (this.keys[32]) { //spacebar
		//
	}
	if (this.keys[69]) { //e
		Game.player.interact();
	}
	if (this.keys[70]) {
		Game.player.toggleFlashlight();
	}
	if (this.keys[71]) {
		Game.player.drop();
	}
	if (this.keys[82]) {
		Game.player.reloadWeapon();
	}
	if (this.keys[49]) { //1
		Game.player.inventory.selectItemSlot(1);
	}
	if (this.keys[50]) { //2
		Game.player.inventory.selectItemSlot(2);
	}
	if (this.keys[51]) { //3
		Game.player.inventory.selectItemSlot(3);
	}
	if (this.keys[52]) { //4
		Game.player.inventory.selectItemSlot(4);
	}
	if (this.keys[53]) { //5
		Game.player.inventory.selectItemSlot(5);
	}
	if (this.keys[54]) { //6
		Game.player.inventory.selectItemSlot(6);
	}
};

$(window).load(function() {
	window.focus();
	$(window).keydown(function(evt) {
		Game.input.keys[evt.keyCode] = true;
	});
	$(window).keyup(function(evt) {
		Game.input.keys[evt.keyCode] = false;
	});
});

//Disable browsers usual function of scrolling with up/down arrow keys
document.onkeydown = function(event) {
	return event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 32;
};

$('#canvas').bind('contextmenu', function(e) {
	//Right click callback
	return false; //Disable usual context menu behaviour
});
$("#canvas").mousedown(function(event) {
	event.preventDefault();
	Game.input.mouse.down = true;
});
$("#canvas").mouseup(function(event) {
	Game.input.mouse.down = false;
});

//Mouse movement
$('#canvas').mousemove(function(e) {
	Game.input.mouse.x = e.pageX - this.offsetLeft + 15;
	Game.input.mouse.y = e.pageY - this.offsetTop + 15;
	if (Game === null) return;
	if (Game.screen !== null) {
		//mouse.x += screen.xOffset;
		//mouse.y += screen.yOffset;
	}
});

//Mouse clicks hook
$("#canvas").click(function(e) {
	window.focus();
});