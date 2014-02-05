//Zombie.js

function Zombie(x, y) {
	this.x = x;
	this.y = y;
	this.xv = 0;
	this.yv = 0;
	this.width = 16;
	this.height = 16;
	this.target = new Point(0, 0);
	this.selected = false;
	this.layer = 2;
	this.rotation = 0;
	this.lastUpdate = 0;
	this.sprite = new Sprite("images/zombie.png");
	this.scale = 1;
	this.boundingBox = new BoundingBox(this.x, this.y, 16, 16);
	this.visionBox = new BoundingBox(this.x, this.y, 16, 16);
	this.vision = random(120, 150);
	this.health = 100;
	this.speed = 1 + (Math.random() * 0.6);
	this.isDying = false;
	this.deathTime = 0;
	this.lastAttack = 0;
	this.lastWander = 0;
	Game.entities.push(this);
}

Zombie.prototype.render = function() {
	if (this.target !== null) {
		this.rotation = Math.atan2(this.y - Game.player.y, this.x - Game.player.x) * (180 / Math.PI);
		if (this.rotation < 0) {
			this.rotation += 360;
		}
		this.rotation -= 90;
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
	if (this.target instanceof Point) {
		var dirx = (this.target.x - this.x);
		var diry = (this.target.y - this.y);

		var hyp = Math.sqrt(dirx * dirx + diry * diry);
		dirx /= hyp;
		diry /= hyp;
		this.xv = dirx * this.speed;
		this.yv = diry * this.speed;
	}
	var canMovex = true;
	var canMovey = true;
	var xpos = Math.floor((this.x / 32)) - 3;
	var ypos = Math.floor((this.y / 32)) - 3;
	if (xpos < 0) xpos = 0;
	if (xpos > Game.level.width - 6) xpos = Game.level.width - 6;
	if (ypos < 0) ypos = 0;
	if (ypos > Game.level.height - 6) ypos = Game.level.height - 6;
	for (var y = ypos; y < ypos + 6; y++) {
		for (var x = xpos; x < xpos + 6; x++) {
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
		if ((Game.entities[i] instanceof Player || Game.entities[i] instanceof Zombie || Game.entities[i] instanceof Barricade) && Game.entities[i] !== this) {
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
		for (var i = 0; i < Game.entities.length; i++) {
			if (Game.entities[i] instanceof Barricade) {
				var distToBarricade = new Point(this.x, this.y).getDist(new Point(Game.entities[i].x, Game.entities[i].y));
				if (distToBarricade < 32) {
					Game.entities[i].takeDamage(10);
					break;
				}
			}
		}
		this.lastAttack = getCurrentMs();
	}
};

Zombie.prototype.think = function() {
	var distToPlayer = new Point(Game.player.x, Game.player.y).getDist(new Point(this.x, this.y));
	var thisXTile = (this.x - (this.x % 32)) / 32;
	var thisYTile = (this.y - (this.y % 32)) / 32;
	var playerXTile = (Game.player.x - (Game.player.x % 32)) / 32;
	var playerYTile = (Game.player.y - (Game.player.y % 32)) / 32;

	//Using astar.js
	var graph = new Graph(Game.level.collisionTiles);
	var start = graph.nodes[thisXTile][thisYTile];
	var end = graph.nodes[playerXTile][playerYTile];
	var result = astar.search(graph.nodes, start, end, true); //Set last param to true to include diagonal path, false without

	if (result[0] !== undefined) {
		var rand = Math.floor(Math.random() * 8) + 8;
		this.target = new Point((result[0].x * 32) + rand, (result[0].y * 32) + rand);
	} else {
		this.target = new Point(Game.player.x, Game.player.y);
	}
	if (!this.isDying) {
		this.attack();
	}
};

Zombie.prototype.update = function() {
	this.boundingBox.update(this.x - 8, this.y - 8);
	this.think();

	if (this.isDying) {
		this.deathTime++;
		if (this.sprite.alpha === 0) {
			Game.player.kills++;
			Game.deleteEntity(this);
		}
		return;
	}
	this.move();
};

Zombie.prototype.hurt = function(amount) {
	this.health -= amount;
	this.wandering = false;
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