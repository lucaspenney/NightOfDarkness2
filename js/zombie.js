//Zombie.js

function Zombie(x, y) {
	this.x = x;
	this.y = y;
	this.xv = 0;
	this.yv = 0;
	this.width = 16;
	this.height = 16;
	this.target = new Point(400, 200);
	this.selected = false;
	this.layer = 2;
	this.rotation = 0;
	this.lastUpdate = 0;
	this.sprite = new Sprite("images/zombie.png");
	this.scale = 1;
	this.boundingBox = new BoundingBox(this.x, this.y, 16, 16);
	this.visionBox = new BoundingBox(this.x, this.y, 16, 16);
	this.vision = random(120, 150);
	this.health = 50;
	this.speed = 1 + (Math.random() * 0.6);
	this.isDying = false;
	this.deathTime = 0;
	this.lastAttack = 0;
	this.wandering = true;
	this.lastWander = 0;
	Game.entities.push(this);
}

Zombie.prototype.render = function() {
	if (this.target !== null) {
		this.rotation = Math.atan2(this.y - (this.height / 2) - this.target.y, this.x - (this.width / 2) - this.target.x) * (180 / Math.PI);
		if (this.rotation < 0) {
			this.rotation += 360;
		}
		this.rotation -= 85;
	}
	this.sprite.rotation = this.rotation;
	if (this.isDying) {
		this.rotation = this.deathRotation;
		this.sprite.xOffset = 16;
	} else this.sprite.xOffset = 0;

	this.sprite.renderOnScreen(this.x, this.y);
};


Zombie.prototype.move = function() {
	if (this.target === null) return;
	if (getCurrentMs() - this.lastUpdate > 2.5) {
		var distToPlayer = new Point(this.x, this.y).getDist(new Point(Game.player.x, Game.player.y));
		if (distToPlayer < 90 && Math.random() * 10 < 7) {
			Game.sound.playZombieSound(false);
			this.lastUpdate = getCurrentMs();
		}
	}
	if (!this.wandering) {
		//Chasing player
		var distToPlayer = new Point(this.x, this.y).getDist(new Point(Game.player.x, Game.player.y));
		this.target = new Point(Game.player.x - 4, Game.player.y - 1);
	}

	if (this.target instanceof Point) {
		var dirx = (this.target.x - this.x);
		var diry = (this.target.y - this.y);

		var hyp = Math.sqrt(dirx * dirx + diry * diry);
		dirx /= hyp;
		diry /= hyp;
		this.xv = dirx * this.speed;
		this.yv = diry * this.speed;
		if (hyp < 5) {
			this.target = null;
		}
	}
	var canMovex = true;
	var canMovey = true;
	var xpos = Math.floor((this.x / 32)) - 5;
	var ypos = Math.floor((this.y / 32)) - 5;
	if (xpos < 0) xpos = 0;
	if (xpos > Game.level.width - 10) xpos = Game.level.width - 10;
	if (ypos < 0) ypos = 0;
	if (ypos > Game.level.height - 10) ypos = Game.level.height - 10;
	for (var y = ypos; y < ypos + 10; y++) {
		for (var x = xpos; x < xpos + 10; x++) {
			if (Game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(this.xv, 0, Game.level.tiles[x][y])) {
					canMovex = false;
					if (this.yv < 1 && this.yv > 0) this.yv = 1; //Maintain constant speed while going around corners
					if (this.yv > -1 && this.yv < 0) this.yv = -1;
				}
				if (this.boundingBox.wouldCollide(0, this.yv, Game.level.tiles[x][y])) {
					canMovey = false;
					if (this.xv < 1 && this.xv > 0) this.xv = 1;
					if (this.xv > -1 && this.xv < 0) this.xv = -1;
				}
			}
		}
	}

	for (var i = 0; i < Game.entities.length; i++) {
		if ((Game.entities[i] instanceof Player || Game.entities[i] instanceof Zombie || Game.entities[i] instanceof Npc) && Game.entities[i] !== this) {
			if (this.boundingBox.wouldCollide(this.xv, 0, Game.entities[i])) {
				canMovex = false;

			}
			if (this.boundingBox.wouldCollide(0, this.yv, Game.entities[i])) {
				canMovey = false;

			}
		}
	}

	if (canMovex) {
		this.x += this.xv;
	}
	if (canMovey) {
		this.y += this.yv;
	}
};

Zombie.prototype.attack = function() {
	if ((getCurrentMs()) - this.lastAttack > 1) {
		var distToPlayer = new Point(this.x, this.y).getDist(new Point(Game.player.x, Game.player.y));
		if (distToPlayer < 30) {
			Game.player.takeDamage(Math.floor(Math.random() * 10) + 10);
		}
		this.lastAttack = getCurrentMs();
	}
};

Zombie.prototype.think = function() {
	var distToPlayer = new Point(Game.player.x, Game.player.y).getDist(new Point(this.x, this.y));
	if (distToPlayer < this.vision) {
		this.target = new Point(Game.player.x, Game.player.y);
		this.wandering = false;
	} else {
		if (Math.random() * 10 > 8) {
			if ((getCurrentMs()) - this.lastWander > 5) {
				var r1 = Math.floor(Math.random() * 125) - 75;
				var r2 = Math.floor(Math.random() * 125) - 75;
				this.target = new Point(this.x + r1, this.y + r2);
				this.lastWander = getCurrentMs();
			}
		}
	}
	if (this.boundingBox.wouldCollide(this.xv, this.yv, Game.player) && !this.isDying) {
		this.attack();
	}
};

Zombie.prototype.update = function() {
	this.boundingBox.update(this.x - 8, this.y - 8);
	this.think();

	if (this.isDying) {
		this.deathTime++;
		if (this.deathTime > 25) {
			Game.player.kills++;
			Game.deleteEntity(this);
		}
		return;
	}
	this.move();
};

Zombie.prototype.hurt = function() {
	this.health -= 10;
	this.target = new Point(Game.player.x, Game.player.y);
	Game.particles.createBloodParticles(this.x, this.y);
	if (this.health <= 0) {
		new Decal(this.x, this.y, 'images/blood.png');
		this.isDying = true;
		this.deathRotation = this.rotation;
		this.sprite.fadeOut();
		this.layer = 0;
		this.boundingBox.setHeight(0);
		this.boundingBox.setWidth(0);
		Game.sound.playZombieSound(true);
	}
};