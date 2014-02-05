function WaveManager() {
	this.currentWave = 0;
	this.currentWaveTime = 0;
	this.waitTime = 5;
	this.waves = [];
	for (var i = 0; i < 20; i++) {
		var enemies = (i * 5) + 5;
		this.waves[i] = new Wave(this, enemies);
	}
}

WaveManager.prototype.startWave = function(wave) {
	if (wave <= this.waves.length - 1) {
		Game.sound.waveSound.play();
		this.currentWave = wave;
	}
	this.waitTime = 5;
};

WaveManager.prototype.tick = function() {
	if (this.waitTime <= 0) {
		this.waves[this.currentWave].update();
	} else this.waitTime--;
};

function Wave(manager, enemies, params) {
	this.manager = manager;
	this.enemies = enemies;
	this.spawns = 0;
	this.params = params;
}

Wave.prototype.update = function() {
	if (this.spawns < this.enemies) {
		for (var i = 0; i < Game.entities.length; i++) {
			if (Game.entities[i] instanceof ZombieSpawner) {
				if (Game.entities[i].canSpawn()) {
					Game.entities[i].spawn();
					this.spawns++;
					if (this.spawns >= this.enemies) return;
				}
			}
		}
	} else {
		var zCount = 0;
		for (var i = 0; i < Game.entities.length; i++) {
			if (Game.entities[i] instanceof Zombie) {
				zCount++;
			}
		}
		if (zCount <= 0)
			this.manager.startWave(this.manager.currentWave + 1);
	}
};