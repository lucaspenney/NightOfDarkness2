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

};

ZombieSpawner.prototype.canSpawn = function() {
	var distToPlayer = new Point(this.x, this.y).getDist(new Point(Game.player.x, Game.player.y));
	var canSpawn = false;
	if (distToPlayer > 275 && distToPlayer < 800) {
		canSpawn = true;
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

	}
	return canSpawn;
};


ZombieSpawner.prototype.spawn = function() {
	new Zombie(this.x, this.y);
	this.spawned++;
	this.lastSpawn = getCurrentMs();
};