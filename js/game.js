var canvas = null;
var ctx = null;

var can2 = null;
var ctx2 = null;


//Draw entire buffer onto main canvas: ctx.drawImage(canvasBuffer, 0, 0);

/* Loading */

var Game = null;

//HTML onLoad event - Loading the game
$(document).ready(function() {
	canvas = document.getElementById('canvas');
	canvas.width = 600;
	canvas.height = 450;
	can2 = document.getElementById('canvas2');
	if (can2 && can2.getContext) {
		ctx2 = can2.getContext('2d');
	}

	can2.width = 600;
	can2.height = 450;

	//check whether browser supports getting canvas context
	if (canvas && canvas.getContext) {
		ctx = canvas.getContext('2d');
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		$(window).focus();
		//ctx.webkitImageSmoothingEnabled = false; //For pixel art scaling
	}

	Game = new GameEngine();
	Game.loader.load();
	Game.loop();
});

$(window).load(function() {
	//setTimeout("Game.loaded=true;Game.inMenu=true", 6000);
});

function GameEngine() {
	this.settings = new Settings();
	this.ui = new UI();
	this.loader = new AssetLoader();
	this.fpsManager = new FPSManager();
	this.sound = new SoundManager();
	this.started = true;
	this.level = null;
	this.currentLevel = 1;
	this.inGame = true; //Are we physically in the game level
	this.mainMenu = new MainMenu(this);
	this.inMenu = true;
	this.particles = true;
	this.loaded = false;
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
	this.inMenu = false;
	this.level = new Level(this.currentLevel);
	this.level.fadeIn();
	this.player = new Player();
	this.ui = new UI();
	this.screen = new Screen();

};
GameEngine.prototype.end = function() {
	this.started = false;
	this.level = null;
	this.inMenu = true;
	this.entities = [];
	this.player = null;
	this.screen = null;
	this.ui = null;
};
GameEngine.prototype.changeLevel = function() {
	this.inGame = false;
	//Clear the entities array - Keep the player and player objects.
	for (var i = 0; i < entities.length; i++) {
		if (entities[i] !== player && entities[i] !== player.gun) {
			deleteEntity(this);
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
	this.ui.gameOver = true;
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
			this.inMenu = true;
			return;
		}
	} else if (this.inMenu) {
		this.mainMenu.render();
		return; //Don't draw the game if we're not in it yet.
	}
	if (this.screen === null || this.screen === undefined) return;
	// draw stuff
	this.level.update();
	ctx.restore();

	this.ui.draw();
	ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.beginPath();
	ctx.arc(this.player.x + Game.screen.xOffset, this.player.y + Game.screen.yOffset, 140, 0, 2 * Math.PI, false);
	//ctx.clip();
	this.ui.draw();
	renderLevel(this.level);
	Game.screen.scroll();
	this.entities.sort(sortByLayer);

	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i] !== null) {
			if (!(this.entities[i] instanceof Player)) this.entities[i].render();
			if (this.inGame) this.entities[i].update();
		}
	}
	drawParticles();
	drawLights();

	ctx.drawImage(can2, 0, 0);
	ctx2.restore();
	this.player.render();
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
	handleInteractions();
};


GameEngine.prototype.debugMsg = function(str) {
	console.log("LuluEngine: " + str);
};


function sortByLayer(a, b) {
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

function deleteEntity(e) {
	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] === e) {
			Game.entities[i] = null; //For now this works. Potentially making arrays very large though, which is bad perf.
			//Game.entities.splice(i,1);
			break;
		}
	}
}