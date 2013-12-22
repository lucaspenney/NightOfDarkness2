function ZombieSpawner(x, y) {
	this.x = x;
	this.y = y;
	this.lastSpawn = 0;
	this.spawned = 0;
	this.spawnRate = 8;
	this.maxNearbyZombies = 6;
	Game.entities.push(this);
}

ZombieSpawner.prototype.render = function() {

};

ZombieSpawner.prototype.update = function() {
	var deconds = Math.floor(Game.level.levelTime / 10);
	this.spawnRate = 8 - Math.floor(deconds / 3); //For every 20 seconds decrease by 1
	this.maxNearbyZombies = 6 + Math.floor(deconds / 5); //For every 50 seconds, add 1 to max zombies
	if (this.spawnRate < 1) this.spawnRate = 1;

	if (getCurrentMs() - this.lastSpawn > this.spawnRate) { //Spawns slow down for each spawn..
		var distToPlayer = new Point(this.x, this.y).getDist(new Point(Game.player.x, Game.player.y));
		if (distToPlayer > 275 && distToPlayer < 800) {
			var canSpawn = true;
			var nearbyZombies = 0;
			for (var i = 0; i < Game.entities.length; i++) {
				if (Game.entities[i] instanceof Zombie) {
					var distToSpawner = new Point(this.x, this.y).getDist(new Point(Game.entities[i].x, Game.entities[i].y));
					if (distToSpawner < 28) canSpawn = false;
					if (distToSpawner < 400) {
						nearbyZombies++;
					}
				}
			}
			if (nearbyZombies > this.maxNearbyZombies) canSpawn = false;
			if (canSpawn) {
				new Zombie(this.x, this.y);
				this.spawned++;
				this.lastSpawn = getCurrentMs();
			}
		}
	}
};