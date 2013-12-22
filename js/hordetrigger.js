function HordeTrigger(x,y) {
	this.x = x;
	this.y = y;
	this.boundingBox = new BoundingBox(this.x,this.y,32,32);
	entities.push(this);
}

HordeTrigger.prototype.update = function() {
	if (player.boundingBox.isColliding(this)) {
		this.callHorde();
	}
};

HordeTrigger.prototype.render = function() {
	//Intentionally blank.
};

HordeTrigger.prototype.callHorde = function() {
	//Set all the zombies to go after the player
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Zombie) {
			entities[i].target = new Point(player.x,player.y);
		}
	}
	deleteEntity(this); //We're done here
};