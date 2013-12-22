function LevelTransition(x, y) {
	this.x = x;
	this.y = y;
	entities.push(this);
}

LevelTransition.prototype.render = function() {

};

LevelTransition.prototype.update = function() {
	var distToPlayer = new Point(this.x, this.y).getDist(new Point(player.x, player.y));
	if (distToPlayer < 32) {
		game.currentLevel++;
		game.level.fadeOut();
		setTimeout("game.changeLevel();", 4000);
		deleteEntity(this);
	}
};