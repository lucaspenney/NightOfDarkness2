function Bullet(gun, x, y, power, target) {
	this.gun = gun;
	this.x = x;
	this.y = y;
	this.target = target;
	this.speed = 6;
	this.xv = (target.x - this.x) * this.speed;
	this.yv = (target.y - this.y) * this.speed;
	this.xv /= this.target.getDist(new Point(this.x, this.y));
	this.yv /= this.target.getDist(new Point(this.x, this.y));
	this.xv *= 1.5;
	this.yv *= 1.5;
	//Some changes to starting position to make bullets come out of gun. Hacky but it works. 
	if (this.xv > 1 && this.yv > 1) {
		this.x -= 5;
		this.y += 5;
	} else if (this.xv < 1 && this.yv > 1) {
		this.x -= 5;
		this.y -= 5;
	} else if (this.xv < 0 && this.yv < 0) {
		this.x += 5;
		this.y -= 5;
	} else if (this.xv > 0 && this.yv < 0) {
		this.x += 5;
		this.y += 5;
	}
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
		ctx.fillStyle = "#CCC";
		ctx.beginPath();
		ctx.arc(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 1, 0, 2 * Math.PI, false);
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
				deleteEntity(this);
			}
		}
	}
	var canMove = true;
	for (var x = 0; x < Game.level.width; x++) {
		for (var y = 0; y < Game.level.height; y++) {
			if (Game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(this.xv, this.yv, Game.level.tiles[x][y])) {
					canMove = false;
					deleteEntity(this);
				}
			}
		}
	}
	if (canMove) {
		this.x += this.xv;
		this.y += this.yv;
	}
};