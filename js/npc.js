
function Npc(x,y,body) {
	entities.push(this);
	this.x = x;
	this.y = y;
	this.body = body;
	this.health = 100;
	this.speed = 1;
	this.xv = 0;
	this.yv = 0;
	this.width = 16;
	this.height = 16;
	this.gun = null;
	new Gun(this.x,this.y,'pistol');
	this.rotation = 0;
	this.target = null;
	this.img = new Image();
	this.img.src = "images/player_npc" + this.body + ".png";
	this.imgout = new Image();
	this.imgout.src = "images/player_npc" + this.body + "out.png";
	this.boundingBox = new BoundingBox(this.x,this.y,this.width,this.height);
	this.scale = 1;
	this.lastUpdate = 0;
	this.lastThink = 0;
}

Npc.prototype.update = function() {
	this.boundingBox.update(this.x+(this.width/2)-16,this.y+(this.height/2)-16);
	this.move();
	if (getCurrentMs() - this.lastUpdate > 0.3) {
		this.target = null;
		var distToTarget = 80;
		if (this.gun !== null) {
			for (var i=0;i<entities.length;i++) {
				if (entities[i] instanceof Zombie) {
					var dist = new Point(entities[i].x,entities[i].y).getDist(new Point(this.x,this.y));
					if (dist < distToTarget) {
						distToTarget = dist;
						this.target = entities[i];
					}
				}
			}
		}
		

		if (!(this.target instanceof Zombie)) {
			if (getCurrentMs() - this.lastThink > random(3,6)) {
				//this.target = new Point(player.x + (Math.floor(Math.random() * 120))-60, player.y + (Math.floor(Math.random() * 120))-60);
				this.lastThink = getCurrentMs();
			}
		}

		if (this.target instanceof Zombie && this.gun !== null) {
			if (random(0,10) > 6)
				this.fire();
		}

		if (this.target instanceof Point) {
			var dirx = (this.target.x - this.x);
			var diry =  (this.target.y - this.y);

			var hyp = Math.sqrt(dirx*dirx + diry*diry);
			dirx /= hyp;
			diry /= hyp;
			this.xv = dirx * this.speed;
			this.yv = diry * this.speed;
			if (hyp < 1) {
				this.target = null;
			}
		}
		this.lastUpdate = getCurrentMs();
	}
	
};

Npc.prototype.render = function() {
	if (this.target instanceof Point || this.target instanceof Zombie) {
		this.rotation = Math.atan2(this.y+screen.yOffset-(this.height/2)-this.target.y+screen.yOffset,this.x+screen.xOffset-(this.width/2)-this.target.x+screen.xOffset)*(180 / Math.PI);
		if(this.rotation < 0) { this.rotation += 360;}
		this.rotation -= 85;
	}
	ctx.save();
	ctx.translate(this.x+screen.xOffset,this.y+screen.yOffset);
	ctx.rotate(degToRad(this.rotation));
	if (this.gun === null) ctx.drawImage(this.img, (-(this.img.width/2)), (-(this.img.height/2)), this.img.width*this.scale,this.img.height*this.scale);
	else if (this.gun !== null) {
		if (this.gun.reloading) ctx.drawImage(this.img, (-(this.img.width/2)), (-(this.img.height/2)), this.img.width*this.scale,this.img.height*this.scale);
		else ctx.drawImage(this.imgout, (-(this.imgout.width/2)), (-(this.imgout.height/2)), this.imgout.width*this.scale,this.imgout.height*this.scale);
	}
	ctx.restore();
};

Npc.prototype.fire = function() {
	if (this.gun !== null) {
		if (new Point(this.x,this.y).getDist(new Point(mouse.x,mouse.y)) > 25) {
			this.gun.fire();
		}
	}
};

Npc.prototype.move = function() {
	var xpos = Math.floor((this.x / 32)) - 5;
	var ypos = Math.floor((this.y / 32)) - 5;
	if (xpos < 0) xpos = 0;
	if (xpos > game.level.width - 10) xpos = game.level.width - 10;
	if (ypos < 0) ypos = 0;
	if (ypos > game.level.height - 10) ypos = game.level.height - 10;
	var canMove = true;
	for (var y=ypos;y<ypos+10;y++)
	{
		for (var x=xpos;x<xpos+10;x++) 
		{
			if (game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(this.xv,this.yv,game.level.tiles[x][y])) {
					canMove = false;
				}
			}
		}
	}

	for (var i=0;i<entities.length;i++) {
		if ((entities[i] instanceof Player) || entities[i] instanceof Zombie && entities[i] !== this) {
			if (this.boundingBox.wouldCollide(this.xv,this.yv,entities[i])) {
				canMove = false;
			}
		}
	}

	if (canMove) {
		this.x += this.xv;
		this.y += this.yv;
	}
};