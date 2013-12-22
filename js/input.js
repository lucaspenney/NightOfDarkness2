//input.js

/* Interactivity */

$(window).load(function() {
	window.focus();
	$(window).keydown(function(evt) {
		keys[evt.keyCode] = true;
	});
	$(window).keyup(function(evt) {
		keys[evt.keyCode] = false;
	});
});

var keys = [];

function Mouse() {
	this.x = 0;
	this.y = 0;
	this.down = false;
}

var mouse = new Mouse();
//Disable browsers usual function of scrolling with up/down arrow keys
document.onkeydown = function(event) {
	return event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 32;
};



function handleKeyDown(evt) {
	keys[evt.keyCode] = true;
}

function handleKeyUp(evt) {
	keys[evt.keyCode] = false;
}
$('#canvas').bind('contextmenu', function(e) {
	rightClick(e);
	return false; //Disable usual context menu behaviour
});
$("#canvas").mousedown(function(event) {
	event.preventDefault();
	mouse.down = true;
});
$("#canvas").mouseup(function(event) {
	mouse.down = false;
});
//Function for key bindings
function handleInteractions() {
	if (Game.player === null) return;
	if (keys[38] || keys[87]) { //Up arrow
		Game.player.move(0, -2);
	}
	if (keys[37] || keys[65]) { //Left Arrow
		Game.player.move(-2, 0);
	}
	if (keys[39] || keys[68]) { //right arrow
		Game.player.move(2, 0);
	}
	if (keys[40] || keys[83]) { //down arrow
		Game.player.move(0, 2);
	}
	if (keys[32]) { //spacebar
		//
	}
	if (keys[69]) { //e
		Game.player.use();
	}
	if (keys[70]) {
		Game.player.toggleFlashlight();
	}
	if (keys[71]) {
		Game.player.drop();
	}
	if (keys[82]) {
		Game.player.reloadWeapon();
	}

}

//Mouse movement
$('#canvas').mousemove(function(e) {
	mouse.x = e.pageX - this.offsetLeft,
	mouse.y = e.pageY - this.offsetTop;
	if (Game === null) return;
	if (Game.screen !== null) {
		//mouse.x += screen.xOffset;
		//mouse.y += screen.yOffset;
	}
});

function rightClick(e) {

}

//Mouse clicks hook
$("#canvas").click(function(e) {
	window.focus();
	if (Game.inMenu) Game.mainMenu.handleInput();
});