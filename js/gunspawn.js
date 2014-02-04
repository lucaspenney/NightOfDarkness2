function GunSpawn(x, y) {
	this.x = x;
	this.y = y;
	this.lastUpdate = 0;
	this.spawnRate = 45;
	Game.entities.push(this);
}

GunSpawn.prototype.render = function() {

};

GunSpawn.prototype.update = function() {
	if ((this.lastUpdate - getCurrentMs()) < -this.spawnRate) {
		var canSpawn = true;
		for (var i = 0; i < Game.entities.length; i++) {
			if (Game.entities[i] instanceof Gun) {
				if (Game.entities[i].owner === null) {
					if (new Point(this.x, this.y).getDist(new Point(Game.entities[i].x, Game.entities[i].y)) < 75) {
						canSpawn = false;
					}
				}
			}
		}
		var distToPlayer = new Point(Game.player.x, Game.player.y).getDist(new Point(this.x, this.y));
		if (canSpawn && distToPlayer > 350) {
			var rand = Math.floor(Math.random() * 6) + 1;
			switch (rand) {
				case 1:
					new Gun(this.x + 16, this.y + 16, 'pistol');
					break;
				case 2:
					new Gun(this.x + 16, this.y + 16, 'revolver');
					break;
				case 3:
					new Gun(this.x + 16, this.y + 16, 'smg');
					break;
				case 4:
					new Gun(this.x + 16, this.y + 16, 'shotgun');
					break;
				case 5:
					new Gun(this.x + 16, this.y + 16, 'machinegun');
					break;
			}
		}
		this.lastUpdate = getCurrentMs();
	}
};