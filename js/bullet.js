function Bullet(gun, x, y, power, target) {
	this.gun = gun;
	this.x = x;
	this.y = y;
	this.lastPos = new Point(this.x, this.y);
	this.target = target;
	this.speed = 12;
	this.xv = (target.x - this.x) * this.speed;
	this.yv = (target.y - this.y) * this.speed;
	this.xv /= this.target.getDist(new Point(this.x, this.y));
	this.yv /= this.target.getDist(new Point(this.x, this.y));
	this.boundingBox = new BoundingBox(this.x, this.y, 3, 3);
	this.rotation = 0;
	this.scale = 0;
	this.lifeTime = 0;
	Game.entities.push(this);
}
var muzzleFlash = new Image();
muzzleFlash.src = 'images/muzzleflash.png';

Bullet.prototype.render = function() {
	if (this.lifeTime < 2) {
		ctx.save();
		ctx.translate(this.gun.owner.x + Game.screen.xOffset, this.gun.owner.y + Game.screen.yOffset);
		ctx.rotate(degToRad(this.gun.owner.rotation + 180));
		ctx.drawImage(muzzleFlash, -40, (-(this.gun.owner.height / 2)), muzzleFlash.width, muzzleFlash.height);
		ctx.restore();
	} else {
		ctx.strokeStyle = "rgba(180,180,180,0.9)";
		//ctx.beginPath();
		//ctx.arc(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 1, 0, 2 * Math.PI, false);
		ctx.beginPath();
		ctx.moveTo(this.lastPos.x + Game.screen.xOffset, this.lastPos.y + Game.screen.yOffset);
		ctx.lineTo(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
};

var bulletImage = new Image();
bulletImage.src = 'images/bullet.png';

Bullet.prototype.update = function() {
	this.boundingBox.update(this.x, this.y);
	this.lifeTime++;

	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] instanceof Zombie) {
			if (this.boundingBox.wouldCollide(this.xv, this.yv, Game.entities[i])) {
				Game.entities[i].hurt(this.power);
				Game.deleteEntity(this);
			}
		}
	}
	var canMove = true;
	var xpos = Math.floor((this.x / 32)) - 5;
	var ypos = Math.floor((this.y / 32)) - 5;
	if (xpos < 0) xpos = 0;
	if (xpos > Game.level.width - 10) xpos = Game.level.width - 10;
	if (ypos < 0) ypos = 0;
	if (ypos > Game.level.height - 10) ypos = Game.level.height - 10;
	for (var x = xpos; x < xpos + 10; x++) {
		for (var y = ypos; y < ypos + 10; y++) {
			if (Game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(this.xv, this.yv, Game.level.tiles[x][y])) {
					canMove = false;
					var xa = 0;
					var ya = 0;
					var count = 0;
					while (!this.boundingBox.wouldCollide(xa, ya, Game.level.tiles[x][y])) {
						xa += reduceToOne(this.xv);
						ya += reduceToOne(this.yv);
						count++;
						if (count > 10) break; //This is a bit hacky, but for some reason this can occasionally become an infinite loop
					}
					Game.particles.createSparkParticles(this.x + xa, this.y + ya);
					Game.deleteEntity(this);
					return;
				}
			}
		}
	}
	this.lastPos.x = this.x;
	this.lastPos.y = this.y;
	if (canMove) {
		this.x += this.xv;
		this.y += this.yv;
	}
};