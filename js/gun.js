function Gun(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.pickedUp = false;
	this.lastFire = 0;
	this.img = new Image();
	this.sprite = null;
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
				this.sprite = new Sprite('images/pistol.png', true);
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
				this.sprite = new Sprite('images/smg.png', true);
				break;
			}
		case 'shotgun':
			{
				this.fireDelay = 0.6;
				this.ammo = 30;
				this.power = 60;
				this.clipAmmo = 6;
				this.clipSize = 6;
				this.reloadTime = 1.5;
				this.displayName = "Shotgun";
				this.sprite = new Sprite('images/shotgun.png', true);
				break;
			}
		case 'machinegun':
			{
				this.fireDelay = 0.1;
				this.ammo = 100;
				this.power = 20;
				this.clipAmmo = 100;
				this.clipSize = 100;
				this.reloadTime = 1.8;
				this.displayName = "Machine Gun";
				this.sprite = new Sprite('images/machinegun.png', true);
				break;
			}
		case 'revolver':
			{
				this.fireDelay = 0.5;
				this.ammo = 6;
				this.power = 50;
				this.clipAmmo = 6;
				this.clipSize = 6;
				this.reloadTime = 1.8;
				this.displayName = "Revolver";
				this.sprite = new Sprite('images/revolver.png', true);
				break;
			}
	}
	this.boundingBox = new BoundingBox(this.x, this.y, 16, 16);
	this.dropTime = 0;

	Game.entities.push(this);
}

Gun.prototype.pickUp = function(owner) {
	if (this.dropTime - getCurrentMs() < -1 && !this.pickedUp) {
		this.owner = owner;
		this.owner.inventory.addItem(this);
		this.pickedUp = true;
		Game.sound.playGunSound(Game.sound.guns.pickup);
	}
};

Gun.prototype.reloadGun = function() {
	if (!this.reloading) {
		if (this.clipAmmo == this.clipSize) return;
		if (this.ammo === 0 && this.clipAmmo === 0) return;
		this.reloading = true;
		Game.sound.playGunSound(Game.sound.guns.reload);
		this.lastReload = getCurrentMs();
	}
};

Gun.prototype.drop = function() {
	this.x = Game.player.x + (Math.random() * 10) - 10;
	this.y = Game.player.y + (Math.random() * 10) - 10;
	this.pickedUp = false;
	this.sprite.scale = 1;
	this.dropTime = getCurrentMs();
	this.owner.gun = null;
	Game.sound.playGunSound(Game.sound.guns.drop);
};
Gun.prototype.fire = function() {
	if (this.owner === null || this.owner === undefined) return;
	if ((this.lastFire - getCurrentMs()) < -this.fireDelay) {
		if (this.clipAmmo > 0 && !this.reloading) {
			var x = 6,
				y = 2;
			var x2 = x * Math.cos(degToRad(this.owner.rotation)) + y * Math.sin(degToRad(this.owner.rotation));
			var y2 = x * Math.sin(degToRad(this.owner.rotation)) - y * Math.cos(degToRad(this.owner.rotation));
			if (this.owner instanceof Player) new Bullet(this, this.owner.x + x2, this.owner.y + y2, this.power, new Point(Game.input.mouse.x - Game.screen.xOffset, Game.input.mouse.y - Game.screen.yOffset));
			//else if (this.owner instanceof Npc) new Bullet(this, this.owner.x,this.owner.y,this.power, new Point(this.owner.target.x, this.owner.target.y));
			if (this.type == 'shotgun') {
				var r1 = (Math.random() * 50) - 30;
				var r2 = (Math.random() * 50) - 30;
				r1 = 10; //Non-random shotgun bullet distribution
				r2 = -10;
				if (this.owner instanceof Player) {
					new Bullet(this, this.owner.x, this.owner.y, this.power, new Point(Game.input.mouse.x - Game.screen.xOffset + r1, Game.input.mouse.y - Game.screen.yOffset + r1));
					new Bullet(this, this.owner.x, this.owner.y, this.power, new Point(Game.input.mouse.x - Game.screen.xOffset + r2, Game.input.mouse.y - Game.screen.yOffset + r2));
				}
				//else if (this.owner instanceof Npc) {
				//	new Bullet(this, this.owner.x,this.owner.y,this.power, new Point(this.owner.target.x+r1, this.owner.target.y+r1));
				//	new Bullet(this, this.owner.x,this.owner.y,this.power, new Point(this.owner.target.x+r2, this.owner.target.y+r2));
				//}
				Game.sound.playGunSound(Game.sound.guns.shotgun);
			} else if (this.type == 'pistol') {
				Game.sound.playGunSound(Game.sound.guns.pistol);
			} else if (this.type == 'smg') {
				Game.sound.playGunSound(Game.sound.guns.smg);
			} else if (this.type == 'revolver') {
				Game.sound.playGunSound(Game.sound.guns.revolver);
			} else if (this.type == 'machinegun') {
				Game.sound.playGunSound(Game.sound.guns.machinegun);
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
		this.sprite.renderOnScreen(this.x, this.y);
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
	this.boundingBox.update(this.x - (this.sprite.width / 3), this.y);
	this.boundingBox.setHeight(this.sprite.height / 2);
	this.boundingBox.setWidth(this.sprite.width / 2);
};