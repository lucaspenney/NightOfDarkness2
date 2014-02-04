//level.js


function Level(num) {
	var fileName = 'maps/level' + num + '.tmx';
	fileName = 'maps/level1.tmx';
	tmxloader.load(fileName);

	this.tiles = [];
	this.collisionTiles = [];
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = tmxloader.map.width;
	this.height = tmxloader.map.height;
	this.overlayAlpha = 0;
	this.fadeStep = 0;
	this.isFading = false;
	this.levelTime = 0;
	this.lastUpdate = 0;
	this.waves = new WaveManager();

	for (var x = 0; x < this.width; x++) {
		this.tiles[x] = [];
		for (var y = 0; y < this.height; y++) {
			this.tiles[x][y] = new Tile(x * 32, y * 32, tmxloader.map.layers[0].data[y][x]);
		}
	}
	for (var x = 0; x < this.width; x++) {
		this.collisionTiles[x] = [];
		for (var y = 0; y < this.height; y++) {
			if (this.tiles[x][y].solid) {
				this.collisionTiles[x][y] = 0;
			} else {
				this.collisionTiles[x][y] = 1;
			}
		}
	}


	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			switch (tmxloader.map.layers[1].data[y][x] - 64) {
				case 1:
					new PlayerSpawn(x * 32, y * 32);
					break;
				case 2:
					new Zombie(x * 32 + 16, y * 32 + 16);
					break;
				case 3:
					new ZombieSpawner(x * 32 + 16, y * 32 + 16);
					break;
				case 4:
					new LevelTransition(x * 32 + 16, y * 32 + 16);
					break;
				case 5:
					new Gun(x * 32 + 16, y * 32 + 16, 'pistol');
					break;
				case 6:
					new Gun(x * 32 + 16, y * 32 + 16, 'smg');
					break;
				case 7:
					new Gun(x * 32 + 16, y * 32 + 16, 'shotgun');
					break;
				case 8:
					new Gun(x * 32 + 16, y * 32 + 16, 'revolver');
					break;
				case 9:
					new Gun(x * 32 + 16, y * 32 + 16, 'machinegun');
					break;
				case 13:
					new Item(x * 32 + 16, y * 32 + 16, 'ammopack');
					break;
				case 14:
					new Item(x * 32 + 16, y * 32 + 16, 'armorpack');
					break;
				case 15:
					new Item(x * 32 + 16, y * 32 + 16, 'healthpack');
					break;
				case 15:
					new Item(x * 32 + 16, y * 32 + 16, 'flashlight');
					break;
				case 17:
					new Flare(x * 32, y * 32);
					break;
				case 18:
					new Item(x * 32, y * 32, 'batterypack');
					break;
				case 19:
					new Item(x * 32, y * 32, 'barricade');
					break;
				case 20:
					new ItemSpawn(x * 32, y * 32);
					break;
				case 21:
					new GunSpawn(x * 32, y * 32);
					break;
			}
		}
	}
}

Level.prototype.update = function() {
	if (getCurrentMs() - this.lastUpdate > 1) {
		this.levelTime++;
		this.lastUpdate = getCurrentMs();
		this.waves.tick();
	}
};

Level.prototype.render = function() {
	for (var x = 0; x < this.width; x++) { //These ifs check to render tiles only on screen based on pixel values of screen size
		if (x > (((Game.screen.xOffset + 32 - (Game.screen.xOffset % 32)) / 32) * -1) && x < (((Game.screen.xOffset - 600 - 32 - (Game.screen.xOffset % 32)) / 32) * -1)) {
			for (var y = 0; y < this.height; y++) {
				if (y > (((Game.screen.yOffset + 32 - (Game.screen.yOffset % 32)) / 32) * -1) && y < (((Game.screen.yOffset - 450 - 32 - (Game.screen.yOffset % 32)) / 32) * -1))
					this.tiles[x][y].render();
			}
		}
	}
};

Level.prototype.start = function() {
	//TODO: Fade in the level
};

Level.prototype.fadeIn = function() {
	Game.sound.backgroundMusic.play();
	this.overlayAlpha = 1;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeInLevel, 50);
};

Level.prototype.fadeOut = function() {
	Game.sound.backgroundMusic.stop();
	this.overlayAlpha = 0;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeOutLevel, 50);
};

function fadeInLevel() {
	if (Game.level !== null) {
		Game.level.overlayAlpha -= 0.030;
		Game.level.fadeStep++;
		if (Game.level.fadeStep < 75 && Game.level.isFading) {
			setTimeout(fadeInLevel, 50);
		} else {
			Game.level.isFading = false;
		}
	}
}

function fadeOutLevel() {
	if (Game.level !== null) {
		Game.level.overlayAlpha += 0.015;
		Game.level.fadeStep++;
		if (Game.level.fadeStep < 75 && Game.level.isFading) {
			setTimeout(fadeOutLevel, 50);
		} else {
			Game.level.isFading = false;
		}
	}
}

Level.prototype.drawOverlay = function() {
	ctx.fillStyle = "rgba(0, 0, 0, " + this.overlayAlpha + ")";
	ctx.fillRect(0, 0, 600, 450);
};