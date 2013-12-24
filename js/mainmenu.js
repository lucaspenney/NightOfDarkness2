function MainMenu(game) {
	this.inMenu = true;
	this.selectedItem = null;
	this.items = [];
	this.currentScreen = 0;
	this.screens = [];
	this.screens[0] = new MenuScreen([new MenuButton(1, "Play", "Game.start();"),
		new MenuButton(2, "How To Play", "Game.mainMenu.currentScreen = 1"),
		new MenuButton(3, "Options", "Game.mainMenu.currentScreen=2;")
		//new MenuButton(4,"Credits", "Game.mainMenu.currentScreen=3;")
	]);
	this.screens[1] = new MenuScreen([
		new MenuImage(150, 50, "images/tutorial.png"),
		new MenuButton(1, "Back", "Game.mainMenu.currentScreen=0")
	]);
	this.screens[2] = new MenuScreen([
		new MenuSettingButton(1, "Sound: ", "Game.sound", "Game.toggleSound()"),
		new MenuSettingButton(2, "Particles: ", "Game.particles", "Game.toggleParticles()"),
		new MenuButton(3, "Back", "Game.mainMenu.currentScreen=0;")

	]);
	this.screens[3] = new MenuScreen([
		new MenuText("Programming: Lucas Penney", 300, 30),
		new MenuText("Pixel Art: Dylan Wyke", 300, 60),
		new MenuText("Pixel Art: Jonathan Redeker", 300, 90),
		new MenuText("Playtesting: Cole Jorgensen", 300, 120),
		new MenuButton(1, "Back", "Game.mainMenu.currentScreen=0")

	]);

	this.img = new Image();
	this.img.src = 'images/mainmenu.png';
}

MainMenu.prototype.render = function() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(this.img, 0, 0);
	this.screens[this.currentScreen].render();
};

MainMenu.prototype.update = function() {

};

MainMenu.prototype.handleInput = function() {
	for (var i = 0; i < this.screens[this.currentScreen].buttons.length; i++) {
		if (this.screens[this.currentScreen].buttons[i] instanceof MenuButton || this.screens[this.currentScreen].buttons[i] instanceof MenuSettingButton) {
			if (this.screens[this.currentScreen].buttons[i].boundingBox.isPointIn(Game.input.mouse.x, Game.input.mouse.y)) {
				eval(this.screens[this.currentScreen].buttons[i].func); //Execute the code associated with the menu item.
			}
		}
	}
};

function MenuScreen(buttons) {
	this.img = new Image();
	this.img.src = 'images/mainmenu.png';
	this.buttons = buttons;
}

MenuScreen.prototype.render = function() {

	for (var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].render();
	}

};

function MenuButton(num, text, func) {
	this.x = 50;
	this.y = (num * 50) + 25;
	this.text = text;
	this.func = func;
	this.width = 150;
	this.height = 50;
	this.boundingBox = new BoundingBox(this.x, this.y - (this.height / 2), this.width, this.height);
}

MenuButton.prototype.render = function() {

	ctx.textAlign = 'left';
	ctx.font = 'normal 20pt Arial';
	ctx.fillStyle = "#FFF";
	ctx.fillText(this.text, this.x, this.y);
	//ctx.fillStyle = "#00F";
	//ctx.fillRect(this.boundingBox.x,this.boundingBox.y,this.boundingBox.width,this.boundingBox.height);
};

function MenuSettingButton(num, text, variable, func) {
	this.x = 50;
	this.y = (num * 50) + 25;
	this.text = text;
	this.value = variable;
	this.func = func;
	this.width = 150;
	this.height = 50;
	this.boundingBox = new BoundingBox(this.x, this.y - (this.height / 2), this.width, this.height);
}

MenuSettingButton.prototype.render = function() {

	ctx.textAlign = 'left';
	ctx.font = 'normal 20pt Arial';
	ctx.fillStyle = "#FFF";
	this.finalText = this.text;
	var x = eval(this.value);
	if (x) x = "On";
	else x = "Off";
	this.finalText = this.finalText + x;
	ctx.fillText(this.finalText, this.x, this.y);
	//ctx.fillStyle = "#00F";
	//ctx.fillRect(this.boundingBox.x,this.boundingBox.y,this.boundingBox.width,this.boundingBox.height);
};

function MenuText(text, x, y) {
	this.text = text;
	this.x = x;
	this.y = y;
}

MenuText.prototype.render = function() {
	ctx.textAlign = 'left';
	ctx.font = 'normal 16pt Arial';
	ctx.fillStyle = "#FFF";
	ctx.fillText(this.text, this.x, this.y);
};

function MenuImage(x, y, image) {
	this.x = x;
	this.y = y;
	this.img = new Image();
	this.img.src = image;
}

MenuImage.prototype.render = function() {
	ctx.drawImage(this.img, this.x, this.y);
};