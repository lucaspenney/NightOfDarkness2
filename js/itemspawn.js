function ItemSpawn(x, y) {
	this.x = x;
	this.y = y;
	this.lastUpdate = 0;
	this.spawnRate = 30;
	Game.entities.push(this);
}

ItemSpawn.prototype.render = function() {

};

ItemSpawn.prototype.update = function() {
	if ((this.lastUpdate - getCurrentMs()) < -this.spawnRate) {
		var canSpawn = true;
		for (var i = 0; i < Game.entities.length; i++) {
			if (Game.entities[i] instanceof Item) {
				if (!Game.entities[i].pickedUp) {
					if (new Point(this.x, this.y).getDist(new Point(Game.entities[i].x, Game.entities[i].y)) < 75) {
						//No nearby items, clear to spawn an item
						canSpawn = false;
					}
				}
			}
		}
		var distToPlayer = new Point(Game.player.x, Game.player.y).getDist(new Point(this.x, this.y));
		if (canSpawn && distToPlayer > 350) {
			var rand = Math.floor(Math.random() * 3) + 1;
			switch (rand) {
				case 1:
					new Item(this.x + 16, this.y + 16, 'healthpack');
					break;
				case 2:
					new Item(this.x + 16, this.y + 16, 'ammopack');
					break;
				case 3:
					new Item(this.x + 16, this.y + 16, 'batterypack');
					break;
			}
		}
		this.lastUpdate = getCurrentMs();
	}
};