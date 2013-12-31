function PlayerSpawn(x, y) {
	this.x = x;
	this.y = y;
	Game.entities.push(this);
}

PlayerSpawn.prototype.render = function() {

};

PlayerSpawn.prototype.update = function() {
	if (Game.inGame) {
		if (Game.player instanceof Player) {
			Game.player.x = this.x + 16;
			Game.player.y = this.y + 16;
		}
		Game.deleteEntity(this);
	}
};