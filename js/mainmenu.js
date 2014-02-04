function MainMenu() {
	this.menuBackground = new Sprite("images/mainmenu.png", true);
	this.buttons = [];
	this.inMenu = true;
}

MainMenu.prototype.init = function() {
	this.buttons.push(new Button(Game.width / 2 - 100, Game.height - 124, 200, 50, "Play Game", function() {
		Game.start();
	}));
};

MainMenu.prototype.render = function() {
	this.menuBackground.render(0, 0);
	for (var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].render();
	}
};

MainMenu.prototype.update = function() {
	for (var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].update();
	}
};

function Button(x, y, width, height, text, func) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.text = text;
	this.func = func;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
}

Button.prototype.render = function() {
	//Invisible buttons (using menu image)
};

Button.prototype.update = function() {
	if (Game.input.mouse.down) {
		if (this.boundingBox.isPointIn(Game.input.mouse.x, Game.input.mouse.y)) {
			this.func();
		}
	}
};