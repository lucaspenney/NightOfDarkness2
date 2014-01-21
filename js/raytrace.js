function Raytrace(pos, target) {
	this.x = pos.x;
	this.y = pos.y;
	this.target = target;
	this.xv = (target.x - this.x) * 1;
	this.yv = (target.y - this.y) * 1;
	this.xv /= this.target.getDist(new Point(this.x, this.y));
	this.yv /= this.target.getDist(new Point(this.x, this.y));
	this.boundingBox = new BoundingBox(this.x, this.y, 1, 1);


	var impacted = false;
	while (!impacted) {
		this.x += this.xv;
		this.y += this.yv;
		this.boundingBox.update(this.x, this.y);
		var xpos = Math.floor((this.x / 32)) - 3;
		var ypos = Math.floor((this.y / 32)) - 3;
		if (xpos < 0) xpos = 0;
		if (xpos > Game.level.width - 6) xpos = Game.level.width - 6;
		if (ypos < 0) ypos = 0;
		if (ypos > Game.level.height - 6) ypos = Game.level.height - 6;
		for (var y = ypos; y < ypos + 6; y++) {
			for (var x = xpos; x < xpos + 6; x++) {
				if (Game.level.tiles[x][y].solid) {
					if (this.boundingBox.wouldCollide(this.xv, this.yv, Game.level.tiles[x][y])) {
						impacted = true;
						break;
					}
				}
			}
		}

	}
	return new Point(this.x, this.y);
}