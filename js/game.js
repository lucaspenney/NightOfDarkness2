var canvas = null;
var ctx = null;

/* Loading */

var Game = null;

//HTML onLoad event - Loading the game
$(document).ready(function() {
	canvas = document.getElementById('canvas');
	canvas.width = 600 * 2;
	canvas.height = 450 * 2;

	//check whether browser supports getting canvas context
	if (canvas && canvas.getContext) {
		ctx = canvas.getContext('2d');
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		$(window).focus();

		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	}
	ctx.scale(2, 2);

	Game = new GameEngine(600, 450);
	Game.loader.load();
	Game.loop();
});

function GameEngine(width, height) {
	this.width = width;
	this.height = height;
	this.settings = new Settings();
	this.ui = new UI();
	this.loader = new AssetLoader();
	this.fpsManager = new FPSManager();
	this.sound = new SoundManager();
	this.particles = new ParticleManager();
	this.lighting = new LightingManager();
	this.started = true;
	this.level = null;
	this.input = new InputManager();
	this.currentLevel = 1;
	this.inGame = true; //Are we physically in the game level
	this.mainMenu = new MainMenu();
	this.loaded = false;
	this.playerDead = false;
	this.entities = [];
}
GameEngine.prototype.toggleSound = function() {
	if (this.settings.sound) this.settings.sound = false;
	else this.settings.sound = true;
};
GameEngine.prototype.toggleParticles = function() {
	if (this.settings.particles) this.settings.particles = false;
	else this.settings.particles = true;
};
GameEngine.prototype.start = function() {
	this.started = true;
	this.inGame = true;
	this.mainMenu.inMenu = false;
	this.level = new Level(this.currentLevel);
	this.level.fadeIn();
	this.player = new Player();
	this.ui = new UI();
	this.screen = new Screen();
	this.playerDead = false;
};
GameEngine.prototype.end = function() {
	this.started = false;
	this.level = null;
	this.mainMenu.inMenu = true;
	this.entities = [];
	this.player = null;
	this.screen = null;
	this.ui = null;
};
GameEngine.prototype.changeLevel = function() {
	this.inGame = false;
	//Clear the entities array - Keep the player and player objects.
	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] !== Game.player && Game.entities[i] !== Game.player.gun) {
			Game.deleteEntity(this);
		}
	}
	this.currentLevel++;
	this.level = new Level(1);
	this.screen = new Screen();
	this.inGame = true;
	this.level.fadeIn();
};
GameEngine.prototype.gameOver = function() {
	if (typeof kongregate !== 'undefined') {
		if (!kongregate.services.isGuest()) {
			kongregate.stats.submit("Survival Time", this.level.levelTime);
			kongregate.stats.submit("Kill Count", player.kills);
		}
	}
	this.playerDead = true;
	this.inGame = false;
	this.level.fadeOut(); //TODO: Make this pass a callback
	setTimeout("Game.end();", 4800);
};

function loop() {
	Game.loop();
}
GameEngine.prototype.loop = function() {
	requestAnimationFrame(loop);
	this.fpsManager.now = Date.now();
	this.fpsManager.delta = this.fpsManager.now - this.fpsManager.then;
	if (this.fpsManager.delta > this.fpsManager.interval) {
		this.fpsManager.then = this.fpsManager.now - (this.fpsManager.delta % this.fpsManager.interval);
		this.render();
	}
};

GameEngine.prototype.render = function() {
	if (!this.loaded) {
		this.ui.drawLoadingScreen();
		if (this.loader.getLoadPercent() == 100) {
			this.loaded = true;
			this.mainMenu.init();
			return;
		}
	} else if (this.mainMenu.inMenu) {
		this.mainMenu.render();
		this.mainMenu.update();
		return; //Don't draw the game if we're not in it yet.
	}
	if (this.screen === null || this.screen === undefined) return;

	this.screen.update();
	this.level.render();

	this.entities.sort(sortByEntityLayer);
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i] !== null) {
			if (!(this.entities[i] instanceof Player)) this.entities[i].render();
			if (this.inGame) this.entities[i].update();
		}
	}
	this.player.render();
	this.particles.drawParticles();
	this.lighting.render();
	this.level.drawOverlay();
	this.ui.draw();

	//Clean up arrays
	if (this.entities.length > 500) {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities.clean(null);
		}
	}
	if (this.particles.length > 300) {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles.clean(null);
		}
	}
	this.level.update();
	this.input.handleInteractions();
};

GameEngine.prototype.deleteEntity = function(e) {
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i] === e) {
			this.entities[i] = null;
			break;
		}
	}
};

GameEngine.prototype.debugMsg = function(str) {
	console.log("LuluEngine: " + str);
};


function sortByEntityLayer(a, b) {
	if (a === null) return 1;
	if (b === null) return -1;
	if (a.layer === undefined) a.layer = 0;
	if (b.layer === undefined) b.layer = 0;
	if (a.layer < b.layer)
		return -1;
	if (a.layer > b.layer)
		return 1;
	return 0;
}