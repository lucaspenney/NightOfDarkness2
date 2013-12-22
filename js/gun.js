function Gun(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.pickedUp = false;
	this.lastFire = 0;
	this.img = new Image();
	this.displayName = "";
	this.lastReload = 0;
	this.owner = null;
	switch (type) {
		case 'pistol':
			{
				this.fireDelay = 0.4;
				this.ammo = 60;
				this.power = 30;
				this.clipAmmo = 15;
				this.clipSize = 15;
				this.reloadTime = 1.3;
				this.displayName = "Pistol";
				this.img.src = 'images/pistol3.png';
				break;
			}
		case 'smg':
			{
				this.fireDelay = 0.14;
				this.ammo = 120;
				this.power = 15;
				this.clipAmmo = 40;
				this.clipSize = 40;
				this.reloadTime = 1.4;
				this.displayName = "SMG";
				this.img.src = 'images/smg3.png';
				break;
			}
		case 'shotgun':
			{
				this.fireDelay = 0.6;
				this.ammo = 30;
				this.power = 50;
				this.clipAmmo = 6;
				this.clipSize = 6;
				this.reloadTime = 1.5;
				this.displayName = "Shotgun";
				this.img.src = 'images/shotgun2.png';
				break;
			}
	}
	this.boundingBox = new BoundingBox(this.x, this.y, 10, 10);
	this.dropTime = 0;
	Game.entities.push(this);
}

Gun.prototype.pickUp = function(owner) {
	if (this.dropTime - getCurrentMs() < -1 && !this.pickedUp) {
		this.owner = owner;
		this.owner.gun = this;
		this.pickedUp = true;
		if (game.sound) gunpickup.play();
	}
};

Gun.prototype.reloadGun = function() {
	if (!this.reloading) {
		if (this.clipAmmo == this.clipSize) return;
		if (this.ammo === 0 && this.clipAmmo === 0) return;
		this.reloading = true;
		if (game.sound) gunreload.play();
		this.lastReload = getCurrentMs();
	}
};

Gun.prototype.drop = function() {
	this.x = Game.player.x + (Math.random() * 10) - 10;
	this.y = Game.player.y + (Math.random() * 10) - 10;
	this.pickedUp = false;
	this.dropTime = getCurrentMs();
	this.owner.gun = null;
};
Gun.prototype.fire = function() {
	if (this.owner === null || this.owner === undefined) return;
	if ((this.lastFire - getCurrentMs()) < -this.fireDelay) {
		if (this.clipAmmo > 0 && !this.reloading) {
			if (this.owner instanceof Player) new Bullet(this, this.owner.x, this.owner.y, this.power, new Point(mouse.x - Game.screen.xOffset, mouse.y - Game.screen.yOffset));
			//else if (this.owner instanceof Npc) new Bullet(this, this.owner.x,this.owner.y,this.power, new Point(this.owner.target.x, this.owner.target.y));
			if (this.type == 'shotgun') {
				var r1 = (Math.random() * 50) - 30;
				var r2 = (Math.random() * 50) - 30;
				r1 = 10; //Non-random shotgun bullet distribution
				r2 = -10;
				if (this.owner instanceof Player) {
					new Bullet(this, this.owner.x, this.owner.y, this.power, new Point(mouse.x - Game.screen.xOffset + r1, mouse.y - Game.screen.yOffset + r1));
					new Bullet(this, this.owner.x, this.owner.y, this.power, new Point(mouse.x - Game.screen.xOffset + r2, mouse.y - Game.screen.yOffset + r2));
				}
				//else if (this.owner instanceof Npc) {
				//	new Bullet(this, this.owner.x,this.owner.y,this.power, new Point(this.owner.target.x+r1, this.owner.target.y+r1));
				//	new Bullet(this, this.owner.x,this.owner.y,this.power, new Point(this.owner.target.x+r2, this.owner.target.y+r2));
				//}
				if (game.sound) gunshot_shotgun.play();
			} else if (this.type == 'pistol') {
				if (game.sound) gunshot_pistol.play();
			} else if (this.type == 'smg') {
				if (game.sound) gunshot_smg.play();
			}
			this.clipAmmo--;
			this.lastFire = getCurrentMs();
			if (this.clipAmmo <= 0) {
				this.reloadGun();
			}
		}
	}

};

Gun.prototype.render = function() {
	if (!this.pickedUp) {
		ctx.drawImage(this.img, this.x + Game.screen.xOffset, this.y + Game.screen.yOffset);
	}
};

Gun.prototype.update = function() {
	if (!this.pickedUp) {
		if (this.boundingBox.isColliding(Game.player) && Game.player.gun === null) {
			this.pickUp(Game.player);
		} else {
			for (var i = 0; i < Game.entities.length; i++) {
				if (Game.entities[i] instanceof Npc) {
					if (Game.entities[i].gun === null) {
						if (this.boundingBox.isColliding(Game.entities[i])) {
							this.pickUp(Game.entities[i]);
						}
					}
				}
			}
		}
	}
	if (this.reloading) {
		if ((this.lastReload - getCurrentMs()) < -this.reloadTime) {
			this.reloading = false;
			for (var i = this.clipAmmo; i < this.clipSize; i++) {
				if (this.ammo > 0) {
					if (this.clipAmmo < this.clipSize) {
						this.clipAmmo++;
						this.ammo--;
					}
				}
			}
		}
	}
	this.boundingBox.update(this.x, this.y);
};