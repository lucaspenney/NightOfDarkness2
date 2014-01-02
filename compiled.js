function AI() {
	this.state = "wander";
	this.lastThink = 0;
}

AI.prototype.think = function() {
	//AI's update function
};AudioFX = function() {
	var f = "0.4.0";
	var c = false,
		e = document.createElement("audio"),
		a = function(j) {
			var i = e.canPlayType(j);
			return (i === "probably") || (i === "maybe")
		};
	if (e && e.canPlayType) {
		c = {
			ogg: a('audio/ogg; codecs="vorbis"'),
			mp3: a("audio/mpeg;"),
			m4a: a("audio/x-m4a;") || a("audio/aac;"),
			wav: a('audio/wav; codecs="1"'),
			loop: (typeof e.loop === "boolean")
		}
	}
	var d = function(m, i, l) {
		var k = document.createElement("audio");
		if (l) {
			var j = function() {
				k.removeEventListener("canplay", j, false);
				l()
			};
			k.addEventListener("canplay", j, false)
		}
		if (i.loop && !c.loop) {
			k.addEventListener("ended", function() {
				k.currentTime = 0;
				k.play()
			}, false)
		}
		k.volume = i.volume || 0.1;
		k.autoplay = i.autoplay;
		k.loop = i.loop;
		k.src = m;
		return k
	};
	var h = function(i) {
		for (var j = 0; j < i.length; j++) {
			if (c && c[i[j]]) {
				return i[j]
			}
		}
	};
	var g = function(i) {
		var k, j;
		for (k = 0; k < i.length; k++) {
			j = i[k];
			if (j.paused || j.ended) {
				return j
			}
		}
	};
	var b = function(o, j, m) {
		j = j || {};
		var i = j.formats || [],
			l = h(i),
			k = [];
		o = o + (l ? "." + l : "");
		if (c) {
			for (var p = 0; p < (j.pool || 1); p++) {
				k.push(d(o, j, p == 0 ? m : null))
			}
		} else {
			m()
		}
		return {
			audio: (k.length == 1 ? k[0] : k),
			play: function() {
				var n = g(k);
				if (n) {
					n.play()
				}
			},
			stop: function() {
				var r, q;
				for (r = 0; r < k.length; r++) {
					q = k[r];
					q.pause();
					q.currentTime = 0
				}
			}
		}
	};
	b.version = f;
	b.supported = c;
	return b
}();//boundingbox.js

function BoundingBox(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

BoundingBox.prototype.update = function(x,y) {
	this.x = x;
	this.y = y;
};

BoundingBox.prototype.setWidth = function(width) {
	this.width = width;
};

BoundingBox.prototype.setHeight = function(height) {
	this.height = height;
};

BoundingBox.prototype.wouldCollide = function(x,y,e) {
	var wouldCollide = false;
	this.x += x;
	this.y += y;
	if (this.isColliding(e)) wouldCollide = true;
	this.x -= x;
	this.y -= y;
	return wouldCollide;
};

BoundingBox.prototype.isColliding = function(e) {
	if (e === undefined) return false;
	if (this.x + this.width > e.boundingBox.x && this.x < e.boundingBox.x + e.boundingBox.width) {
		if (this.y + this.height > e.boundingBox.y && this.y < e.boundingBox.y + e.boundingBox.height) {
			return true;
		}
	}
	return false;
};

BoundingBox.prototype.getDistBetween = function(e) {
	var point1a = this.x + (this.width/2);
	var point1b = this.y + (this.height/2);
	var point1 = new Point(point1a,point1b);
	var point2a = e.boundingBox.x+(e.boundingBox.width/2);
	var point2b = e.boundingBox.y+(e.boundingBox.height/2);
	var point2 = new Point(point2a,point2b);
	return point1.getDist(point2);

}

BoundingBox.prototype.isPointIn = function(x,y) {
	if (this.x === undefined || this.y === undefined || this.x === null || this.y === null) return -1;
	if (this.x + this.width > x && this.x < x) {
		if (this.y + this.height > y && this.y < y) {
			return true;
		}
	}
	return false;
};

BoundingBox.prototype.destroy = function() {
	//Remove this bounding box?
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
};function Bullet(gun, x, y, power, target) {
	this.gun = gun;
	this.x = x;
	this.y = y;
	this.lastPos = new Point(this.x, this.y);
	this.target = target;
	this.speed = 8;
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
	for (var x = 0; x < Game.level.width; x++) {
		for (var y = 0; y < Game.level.height; y++) {
			if (Game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(this.xv, this.yv, Game.level.tiles[x][y])) {
					canMove = false;
					Game.deleteEntity(this);
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
};function Flare(x, y) {
	this.x = x;
	this.y = y;
	this.layer = 0;
	this.img = new Image();
	this.img.src = 'images/flare.png';
	new Light(this.x, this.y);
	Game.entities.push(this);
}

Flare.prototype.render = function() {
	ctx.drawImage(this.img, this.x + screen.xOffset, this.y + screen.yOffset);
};

Flare.prototype.update = function() {

};

function Light(x, y) {
	this.x = x;
	this.y = y;
	Game.entities.push(this);
}

Light.prototype.render = function(ctx2) {
	//Canvas 2 - cut a hole in the darkness with a gradient
	if (ctx2 === undefined) return;
	ctx2.save();
	var radgrad2 = ctx2.createRadialGradient(this.x + Game.screen.xOffset + 16, this.y + Game.screen.yOffset + 16, 20, this.x + Game.screen.xOffset + 16, this.y + Game.screen.yOffset + 16, 70);
	// radgrad2.addColorStop(0.1, "rgba(150, 20, 0, 0.1)");
	radgrad2.addColorStop(0.1, "rgba(150, 0, 0, 0.65)");
	radgrad2.addColorStop(0.8, "rgba(0, 0, 0, 0)");
	ctx2.fillStyle = radgrad2;
	ctx2.beginPath();
	ctx2.arc(this.x + Game.screen.xOffset + 16, this.y + Game.screen.yOffset + 16, 70, 0, 2 * Math.PI, false);
	ctx2.fill();
	ctx2.restore();
};

Light.prototype.update = function() {

};function FPSManager() {
	this.fps = 30;
	this.now = null;
	this.then = Date.now();
	this.interval = 1000 / this.fps;
	this.delta = null;
}//functions.js

Function.prototype.inherit = function(parent) {
	this.prototype = Object.create(parent.prototype);
};

Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	//return this;
};


function getCurrentMs() {
	var date = new Date();
	var ms = date.getTime() / 1000;
	return ms;
}

function degToRad(angle) {
	return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
	return ((angle * 180) / Math.PI);
}

function random(low, high) {
	var rand = (Math.random() * high) + low;
	return rand;
}var canvas = null;
var ctx = null;

/* Loading */

var Game = null;

//HTML onLoad event - Loading the game
$(document).ready(function() {
	canvas = document.getElementById('canvas');
	canvas.width = 600;
	canvas.height = 450;

	//check whether browser supports getting canvas context
	if (canvas && canvas.getContext) {
		ctx = canvas.getContext('2d');
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		$(window).focus();
		//ctx.webkitImageSmoothingEnabled = false; //For pixel art scaling
	}

	Game = new GameEngine();
	Game.loader.load();
	Game.loop();
});

function GameEngine() {
	this.settings = new Settings();
	this.ui = new UI();
	this.loader = new AssetLoader();
	this.fpsManager = new FPSManager();
	this.sound = new SoundManager();
	this.particles = new ParticleManager();
	this.lighting = new LightingManager();
	this.started = true;
	this.level = null;
	this.input = new InputManager();
	this.currentLevel = 1;
	this.inGame = true; //Are we physically in the game level
	this.mainMenu = new MainMenu(this);
	this.inMenu = true;
	this.loaded = false;
	this.entities = [];
}
GameEngine.prototype.toggleSound = function() {
	if (this.settings.sound) this.settings.sound = false;
	else this.settings.sound = true;
};
GameEngine.prototype.toggleParticles = function() {
	if (this.settings.particles) this.settings.particles = false;
	else this.settings.particles = true;
};
GameEngine.prototype.start = function() {
	this.started = true;
	this.inGame = true;
	this.inMenu = false;
	this.level = new Level(this.currentLevel);
	this.level.fadeIn();
	this.player = new Player();
	this.ui = new UI();
	this.screen = new Screen();

};
GameEngine.prototype.end = function() {
	this.started = false;
	this.level = null;
	this.inMenu = true;
	this.entities = [];
	this.player = null;
	this.screen = null;
	this.ui = null;
};
GameEngine.prototype.changeLevel = function() {
	this.inGame = false;
	//Clear the entities array - Keep the player and player objects.
	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] !== Game.player && Game.entities[i] !== Game.player.gun) {
			Game.deleteEntity(this);
		}
	}
	this.currentLevel++;
	this.level = new Level(1);
	this.screen = new Screen();
	this.inGame = true;
	this.level.fadeIn();
};
GameEngine.prototype.gameOver = function() {
	if (typeof kongregate !== 'undefined') {
		if (!kongregate.services.isGuest()) {
			kongregate.stats.submit("Survival Time", this.level.levelTime);
			kongregate.stats.submit("Kill Count", player.kills);
		}
	}
	this.ui.gameOver = true;
	this.inGame = false;
	this.level.fadeOut(); //TODO: Make this pass a callback
	setTimeout("Game.end();", 4800);
};

function loop() {
	Game.loop();
}
GameEngine.prototype.loop = function() {
	requestAnimationFrame(loop);
	this.fpsManager.now = Date.now();
	this.fpsManager.delta = this.fpsManager.now - this.fpsManager.then;
	if (this.fpsManager.delta > this.fpsManager.interval) {
		this.fpsManager.then = this.fpsManager.now - (this.fpsManager.delta % this.fpsManager.interval);
		this.render();
	}
};

GameEngine.prototype.render = function() {
	if (!this.loaded) {
		this.ui.drawLoadingScreen();
		if (this.loader.getLoadPercent() == 100) {
			this.loaded = true;
			this.inMenu = true;
			return;
		}
	} else if (this.inMenu) {
		this.mainMenu.render();
		return; //Don't draw the game if we're not in it yet.
	}
	if (this.screen === null || this.screen === undefined) return;

	ctx.restore();
	ctx.fillStyle = "rgba(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.save();

	this.ui.draw();
	renderLevel(this.level);
	Game.screen.scroll();
	this.entities.sort(sortByEntityLayer);
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i] !== null) {
			if (!(this.entities[i] instanceof Player)) this.entities[i].render();
			if (this.inGame) this.entities[i].update();
		}
	}
	this.particles.drawParticles();
	this.player.render();

	this.lighting.render();
	this.level.drawOverlay();
	this.ui.draw();

	//Clean up arrays
	if (this.entities.length > 500) {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities.clean(null);
		}
	}
	if (this.particles.length > 300) {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles.clean(null);
		}
	}
	this.level.update();
	this.input.handleInteractions();
};

GameEngine.prototype.deleteEntity = function(e) {
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i] === e) {
			this.entities[i] = null;
			break;
		}
	}
};

GameEngine.prototype.debugMsg = function(str) {
	console.log("LuluEngine: " + str);
};


function sortByEntityLayer(a, b) {
	if (a === null) return 1;
	if (b === null) return -1;
	if (a.layer === undefined) a.layer = 0;
	if (b.layer === undefined) b.layer = 0;
	if (a.layer < b.layer)
		return -1;
	if (a.layer > b.layer)
		return 1;
	return 0;
}function Gun(x, y, type) {
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
				this.power = 60;
				this.clipAmmo = 6;
				this.clipSize = 6;
				this.reloadTime = 1.5;
				this.displayName = "Shotgun";
				this.img.src = 'images/shotgun2.png';
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
				this.img.src = 'images/machinegun.png';
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
	this.dropTime = getCurrentMs();
	this.owner.gun = null;
	Game.sound.playGunSound(Game.sound.guns.drop);
};
Gun.prototype.fire = function() {
	if (this.owner === null || this.owner === undefined) return;
	if ((this.lastFire - getCurrentMs()) < -this.fireDelay) {
		if (this.clipAmmo > 0 && !this.reloading) {
			var x = 6,
				y = 1;
			var x2 = x * Math.cos(degToRad(this.owner.rotation)) + y * Math.sin(degToRad(this.owner.rotation));
			var y2 = x * Math.sin(degToRad(this.owner.rotation)) - y * Math.cos(degToRad(this.owner.rotation));
			x2 /= 2;
			y2 /= 2;
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
};function HordeTrigger(x,y) {
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
};//input.js


function InputManager() {
	this.mouse = new Mouse();
	this.keys = [];
}

function Mouse() {
	this.x = 0;
	this.y = 0;
	this.down = false;
}

InputManager.prototype.handleInteractions = function() {
	if (Game.player === null) return;
	if (this.keys[38] || this.keys[87]) { //Up arrow
		Game.player.move(0, -2);
	}
	if (this.keys[37] || this.keys[65]) { //Left Arrow
		Game.player.move(-2, 0);
	}
	if (this.keys[39] || this.keys[68]) { //right arrow
		Game.player.move(2, 0);
	}
	if (this.keys[40] || this.keys[83]) { //down arrow
		Game.player.move(0, 2);
	}
	if (this.keys[32]) { //spacebar
		//
	}
	if (this.keys[69]) { //e
		Game.player.use();
	}
	if (this.keys[70]) {
		Game.player.toggleFlashlight();
	}
	if (this.keys[71]) {
		Game.player.drop();
	}
	if (this.keys[82]) {
		Game.player.reloadWeapon();
	}
};

$(window).load(function() {
	window.focus();
	$(window).keydown(function(evt) {
		Game.input.keys[evt.keyCode] = true;
	});
	$(window).keyup(function(evt) {
		Game.input.keys[evt.keyCode] = false;
	});
});

//Disable browsers usual function of scrolling with up/down arrow keys
document.onkeydown = function(event) {
	return event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 32;
};

$('#canvas').bind('contextmenu', function(e) {
	//Right click callback
	return false; //Disable usual context menu behaviour
});
$("#canvas").mousedown(function(event) {
	event.preventDefault();
	Game.input.mouse.down = true;
});
$("#canvas").mouseup(function(event) {
	Game.input.mouse.down = false;
});

//Mouse movement
$('#canvas').mousemove(function(e) {
	Game.input.mouse.x = e.pageX - this.offsetLeft;
	Game.input.mouse.y = e.pageY - this.offsetTop;
	if (Game === null) return;
	if (Game.screen !== null) {
		//mouse.x += screen.xOffset;
		//mouse.y += screen.yOffset;
	}
});

//Mouse clicks hook
$("#canvas").click(function(e) {
	window.focus();
	if (Game.inMenu) Game.mainMenu.handleInput();
});function Item(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.pickedUp = false;
	this.sprite = new Sprite("images/items.png");
	switch (type) {
		case 'healthpack':
			{
				this.sprite.xOffset = 48;
				break;
			}
		case 'ammopack':
			{
				this.sprite.xOffset = 32;
				break;
			}
		case 'batterypack':
			{
				this.sprite.xOffset = 16;
				break;
			}
		case 'flashlight':
			{
				this.sprite.xOffset = 0;
				break;
			}
	}
	this.boundingBox = new BoundingBox(this.x, this.y, 10, 10);
	this.dropTime = 0;
	Game.entities.push(this);
}

Item.prototype.pickUp = function() {
	if (this.type === 'ammopack' && Game.player.gun === null) return;
	if (this.type === 'batterypack' && Game.player.battery > 96) return;
	switch (this.type) {
		case 'healthpack':
			{
				Game.player.health += 25;
				if (Game.player.health > 100) Game.player.health = 100;
				break;
			}
		case 'ammopack':
			{
				if (Game.player.gun instanceof Gun) Game.player.gun.ammo += Game.player.gun.clipSize * 4;
				break;
			}
		case 'batterypack':
			{
				Game.player.batteryPower += 50;
				if (Game.player.batteryPower > 100) Game.player.batteryPower = 100;
				break;
			}
		case 'flashlight':
			{
				Game.player.hasFlashlight = true;
				break;
			}
	}
	Game.deleteEntity(this);
};

Item.prototype.render = function() {
	if (!this.pickedUp) {
		this.sprite.renderOnScreen(this.x, this.y);
	}
};

Item.prototype.update = function() {
	if (!this.pickedUp) {
		if (this.boundingBox.isColliding(Game.player)) {
			this.pickUp();
		}
	}
	this.boundingBox.update(this.x, this.y);
};function ItemSpawn(x, y) {
	this.x = x;
	this.y = y;
	this.lastUpdate = 0;
	this.spawnRate = 30;
	Game.entities.push(this);
}

ItemSpawn.prototype.render = function() {

};

ItemSpawn.prototype.update = function() {
	if ((this.lastUpdate - getCurrentMs()) < -this.spawnRate) {
		var canSpawn = true;
		for (var i = 0; i < Game.entities.length; i++) {
			if (Game.entities[i] instanceof Item) {
				if (!Game.entities[i].pickedUp) {
					if (new Point(this.x, this.y).getDist(new Point(Game.entities[i].x, Game.entities[i].y)) < 75) {
						//No nearby items, clear to spawn an item
						canSpawn = false;
					}
				}
			}
		}
		var distToPlayer = new Point(Game.player.x, Game.player.y).getDist(new Point(this.x, this.y));
		if (canSpawn && distToPlayer > 350) {
			var rand = Math.floor(Math.random() * 3) + 1;
			switch (rand) {
				case 1:
					new Item(this.x + 16, this.y + 16, 'healthpack');
					break;
				case 2:
					new Item(this.x + 16, this.y + 16, 'ammopack');
					break;
				case 3:
					new Item(this.x + 16, this.y + 16, 'batterypack');
					break;
			}
		}
		this.lastUpdate = getCurrentMs();
	}
};//level.js


function Level(num) {
	var fileName = 'maps/level' + num + '.tmx';
	fileName = 'maps/level1.tmx';
	tmxloader.load(fileName);

	this.tiles = [];
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = tmxloader.map.width;
	this.height = tmxloader.map.height;
	this.overlayAlpha = 0;
	this.fadeStep = 0;
	this.isFading = false;
	this.levelTime = 0;
	this.lastUpdate = 0;

	for (var x = 0; x < this.width; x++) {
		this.tiles[x] = [];
		for (var y = 0; y < this.height; y++) {
			this.tiles[x][y] = new Tile(x * 32, y * 32, tmxloader.map.layers[0].data[y][x]);
		}
	}

	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			switch (tmxloader.map.layers[1].data[y][x] - 64) {
				case 1:
					new PlayerSpawn(x * 32, y * 32);
					break;
				case 2:
					new Zombie(x * 32 + 16, y * 32 + 16);
					break;
				case 3:
					new ZombieSpawner(x * 32 + 16, y * 32 + 16);
					break;
				case 4:
					new LevelTransition(x * 32 + 16, y * 32 + 16);
					break;
				case 5:
					new Gun(x * 32 + 16, y * 32 + 16, 'pistol');
					break;
				case 6:
					new Gun(x * 32 + 16, y * 32 + 16, 'smg');
					break;
				case 7:
					new Gun(x * 32 + 16, y * 32 + 16, 'shotgun');
					break;
				case 13:
					new Item(x * 32 + 16, y * 32 + 16, 'ammopack');
					break;
				case 14:
					new Item(x * 32 + 16, y * 32 + 16, 'armorpack');
					break;
				case 15:
					new Item(x * 32 + 16, y * 32 + 16, 'healthpack');
					break;
				case 15:
					new Item(x * 32 + 16, y * 32 + 16, 'flashlight');
					break;
				case 17:
					new Flare(x * 32, y * 32);
					break;
				case 18:
					new Item(x * 32, y * 32, 'batterypack');
					break;
				case 20:
					new ItemSpawn(x * 32, y * 32);
					break;
				case 21:
					new Npc(x * 32 + 16, y * 32 + 16, 1);
					break;
				case 22:
					new Npc(x * 32 + 16, y * 32 + 16, 2);
					break;
				case 23:
					new Npc(x * 32 + 16, y * 32 + 16, 3);
					break;
				case 24:
					new Npc(x * 32 + 16, y * 32 + 16, 4);
					break;
			}
		}
	}
}

Level.prototype.update = function() {
	if (getCurrentMs() - this.lastUpdate > 1) {
		this.levelTime++;
		this.lastUpdate = getCurrentMs();
	}
};

function renderLevel(level) {
	for (var x = 0; x < level.width; x++) { //These ifs check to render tiles only on screen based on pixel values of screen size
		if (x > (((Game.screen.xOffset + 32 - (Game.screen.xOffset % 32)) / 32) * -1) && x < (((Game.screen.xOffset - 600 - 32 - (Game.screen.xOffset % 32)) / 32) * -1)) {
			for (var y = 0; y < level.height; y++) {
				if (y > (((Game.screen.yOffset + 32 - (Game.screen.yOffset % 32)) / 32) * -1) && y < (((Game.screen.yOffset - 450 - 32 - (Game.screen.yOffset % 32)) / 32) * -1))
					level.tiles[x][y].render();
			}
		}
	}
}

Level.prototype.start = function() {
	//TODO: Fade in the level
};

Level.prototype.fadeIn = function() {
	//ambience1.play();
	this.overlayAlpha = 1;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeInLevel, 50);
};

Level.prototype.fadeOut = function() {
	Game.sound.ambience1.stop();
	this.overlayAlpha = 0;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeOutLevel, 50);
};

function fadeInLevel() {
	if (Game.level !== null) {
		Game.level.overlayAlpha -= 0.030;
		Game.level.fadeStep++;
		if (Game.level.fadeStep < 75 && Game.level.isFading) {
			setTimeout(fadeInLevel, 50);
		} else {
			Game.level.isFading = false;
		}
	}
}

function fadeOutLevel() {
	if (Game.level !== null) {
		Game.level.overlayAlpha += 0.015;
		Game.level.fadeStep++;
		if (Game.level.fadeStep < 75 && Game.level.isFading) {
			setTimeout(fadeOutLevel, 50);
		} else {
			Game.level.isFading = false;
		}
	}
}

Level.prototype.drawOverlay = function() {
	ctx.fillStyle = "rgba(0, 0, 0, " + this.overlayAlpha + ")";
	ctx.fillRect(0, 0, 600, 450);
};function LevelTransition(x, y) {
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
};var lightingCanvas = document.createElement('canvas');

function LightingManager() {
	var _this = this;
	$(document).ready(function() {
		lightingCanvas.width = 600;
		lightingCanvas.height = 450;
		_this.ctx = lightingCanvas.getContext('2d');
	});
	this.ctx = lightingCanvas.getContext('2d');
	this.fullbright = false;
	this.filter = null;
	this.flashlightSprite = new Sprite("images/flashlight.png");
}

LightingManager.prototype.render = function() {
	if (this.ctx === null || this.ctx === undefined) return;

	this.ctx.save();
	this.ctx.fillStyle = "#000";
	this.ctx.fillRect(0, 0, lightingCanvas.width, lightingCanvas.height);
	this.ctx.fill();


	this.ctx.globalCompositeOperation = 'destination-out';
	var radgrad = this.ctx.createRadialGradient(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 20, Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 300);
	if (Game.player.flashlight) {
		radgrad.addColorStop(0, "rgba(0, 0, 0, 1)");
		radgrad.addColorStop(0.1, "rgba(0, 0, 0, 0.3)");
		radgrad.addColorStop(0.32, "rgba(0, 0, 0, 0.1)");
		radgrad.addColorStop(0.4, "rgba(0, 0, 0, 0.03)");
		radgrad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
	} else {
		radgrad.addColorStop(0, "rgba(0, 0, 0, 1)");
		radgrad.addColorStop(0.1, "rgba(0, 0, 0, 0.3)");
		radgrad.addColorStop(0.2, "rgba(0, 0, 0, 0.1)");
		radgrad.addColorStop(0.3, "rgba(0, 0, 0, 0)");
	}
	this.ctx.fillStyle = radgrad;
	this.ctx.beginPath();
	this.ctx.arc(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset, 300, 0, 2 * Math.PI, false);
	this.ctx.fill();

	if (Game.player.flashlight) {
		this.ctx.save();
		this.ctx.translate(Game.player.x + Game.screen.xOffset, Game.player.y + Game.screen.yOffset);
		this.ctx.rotate(degToRad(Game.player.rotation + 180));
		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.drawImage(this.flashlightSprite.img, -40, 0, this.flashlightSprite.img.width, this.flashlightSprite.img.height);
		this.ctx.restore();
	}

	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] instanceof Light) {
			Game.entities[i].render(this.ctx);
			Game.entities[i].update();
		}
	}
	ctx.drawImage(lightingCanvas, 0, 0);
	this.ctx.restore();
};function AssetLoader() {
	//this.callback = callback;
	this.assets = [
		"images/mainmenu.png",
		"images/tilesheet.png",
		"images/player.png",
		"images/zombie.png",
		"images/pistol3.png",
		"images/smg3.png",
		"images/shotgun2.png",
		"images/flare.png"
	];
	this.assetsLoaded = 0;
	this.totalAssets = 1;
}

AssetLoader.prototype.load = function() {
	this.totalAssets = 39;
	var _this = this;
	for (var i = 0; i < this.assets.length; i++) {
		if (this.assets[i].indexOf(".png" != -1)) {
			var img = new Image();
			img.src = this.assets[i];
			img.onload = function() {
				_this.assetsLoaded++;
				console.log("Assets loaded:" + _this.assetsLoaded);
			};
		}
	}
};

AssetLoader.prototype.getLoadPercent = function() {
	var percent = (this.assetsLoaded / this.totalAssets) * 100;
	if (percent > 100) percent = 100;
	if (percent < 0) percent = 0;
	if (isNaN(percent)) percent = 0;
	return percent;
};function MainMenu(game) {
	this.inMenu = true;
	this.selectedItem = null;
	this.items = [];
	this.currentScreen = 0;
	this.screens = [];
	this.screens[0] = new MenuScreen([new MenuButton(1, "Play", "Game.start();"),
		new MenuButton(2, "How To Play", "Game.mainMenu.currentScreen = 1"),
		new MenuButton(3, "Options", "Game.mainMenu.currentScreen=2;")
		//new MenuButton(4,"Credits", "Game.mainMenu.currentScreen=3;")
	]);
	this.screens[1] = new MenuScreen([
		new MenuImage(150, 50, "images/tutorial.png"),
		new MenuButton(1, "Back", "Game.mainMenu.currentScreen=0")
	]);
	this.screens[2] = new MenuScreen([
		new MenuSettingButton(1, "Sound: ", "Game.sound", "Game.toggleSound()"),
		new MenuSettingButton(2, "Particles: ", "Game.particles", "Game.toggleParticles()"),
		new MenuButton(3, "Back", "Game.mainMenu.currentScreen=0;")

	]);
	this.screens[3] = new MenuScreen([
		new MenuText("Programming: Lucas Penney", 300, 30),
		new MenuText("Pixel Art: Dylan Wyke", 300, 60),
		new MenuText("Pixel Art: Jonathan Redeker", 300, 90),
		new MenuText("Playtesting: Cole Jorgensen", 300, 120),
		new MenuButton(1, "Back", "Game.mainMenu.currentScreen=0")

	]);

	this.img = new Image();
	this.img.src = 'images/mainmenu.png';
}

MainMenu.prototype.render = function() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(this.img, 0, 0);
	this.screens[this.currentScreen].render();
};

MainMenu.prototype.update = function() {

};

MainMenu.prototype.handleInput = function() {
	for (var i = 0; i < this.screens[this.currentScreen].buttons.length; i++) {
		if (this.screens[this.currentScreen].buttons[i] instanceof MenuButton || this.screens[this.currentScreen].buttons[i] instanceof MenuSettingButton) {
			if (this.screens[this.currentScreen].buttons[i].boundingBox.isPointIn(Game.input.mouse.x, Game.input.mouse.y)) {
				eval(this.screens[this.currentScreen].buttons[i].func); //Execute the code associated with the menu item.
			}
		}
	}
};

function MenuScreen(buttons) {
	this.img = new Image();
	this.img.src = 'images/mainmenu.png';
	this.buttons = buttons;
}

MenuScreen.prototype.render = function() {

	for (var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].render();
	}

};

function MenuButton(num, text, func) {
	this.x = 50;
	this.y = (num * 50) + 25;
	this.text = text;
	this.func = func;
	this.width = 150;
	this.height = 50;
	this.boundingBox = new BoundingBox(this.x, this.y - (this.height / 2), this.width, this.height);
}

MenuButton.prototype.render = function() {

	ctx.textAlign = 'left';
	ctx.font = 'normal 20pt Arial';
	ctx.fillStyle = "#FFF";
	ctx.fillText(this.text, this.x, this.y);
	//ctx.fillStyle = "#00F";
	//ctx.fillRect(this.boundingBox.x,this.boundingBox.y,this.boundingBox.width,this.boundingBox.height);
};

function MenuSettingButton(num, text, variable, func) {
	this.x = 50;
	this.y = (num * 50) + 25;
	this.text = text;
	this.value = variable;
	this.func = func;
	this.width = 150;
	this.height = 50;
	this.boundingBox = new BoundingBox(this.x, this.y - (this.height / 2), this.width, this.height);
}

MenuSettingButton.prototype.render = function() {

	ctx.textAlign = 'left';
	ctx.font = 'normal 20pt Arial';
	ctx.fillStyle = "#FFF";
	this.finalText = this.text;
	var x = eval(this.value);
	if (x) x = "On";
	else x = "Off";
	this.finalText = this.finalText + x;
	ctx.fillText(this.finalText, this.x, this.y);
	//ctx.fillStyle = "#00F";
	//ctx.fillRect(this.boundingBox.x,this.boundingBox.y,this.boundingBox.width,this.boundingBox.height);
};

function MenuText(text, x, y) {
	this.text = text;
	this.x = x;
	this.y = y;
}

MenuText.prototype.render = function() {
	ctx.textAlign = 'left';
	ctx.font = 'normal 16pt Arial';
	ctx.fillStyle = "#FFF";
	ctx.fillText(this.text, this.x, this.y);
};

function MenuImage(x, y, image) {
	this.x = x;
	this.y = y;
	this.img = new Image();
	this.img.src = image;
}

MenuImage.prototype.render = function() {
	ctx.drawImage(this.img, this.x, this.y);
};
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
};function ParticleManager() {
	this.particles = [];
}

ParticleManager.prototype.drawParticles = function() {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].render();
		this.particles[i].update();
	}
};

ParticleManager.prototype.deleteParticle = function(p) {
	for (var i = 0; i < this.particles.length; i++) {
		if (this.particles[i] == p) {
			this.particles.splice(i, 1);
			break;
		}
	}
};

ParticleManager.prototype.createBloodParticles = function(x, y) {
	var particleCount = Math.floor((Math.random() * 25)) + 5;
	while (particleCount--) {
		this.particles.push(new Particle(x, y, 122, 7, 1, random(0, Math.PI * 2), random(0.3, 2.5), 0.8, 0.9, 0.9, 30));
	}
};

/* Particle Object */

function Particle(x, y, r, g, b, angle, speed, friction, alpha, decay, lifetime) {
	this.x = x;
	this.y = y;
	this.lifeTime = lifetime;
	this.timeAlive = 0;
	this.r = r;
	this.g = g;
	this.b = b;
	this.coordinates = [];
	this.coordinateCount = 10;
	this.angle = angle;
	this.speed = speed;
	this.friction = friction;
	this.alpha = alpha;
	this.decay = decay;
	while (this.coordinateCount--) {
		this.coordinates.push([this.x, this.y]);
	}
	Game.particles.particles.push(this);
}

Particle.prototype.render = function() {
	if (!Game.settings.particles) return;
	//TODO: Do not render offscreen particles. An onscreen check may be too costly, perhaps don't create them if offscreen?
	//Will have to look into the best way to do this. Reducing the number of particles is also a perf optimization possibility
	//Upper limit on number of particles perhaps?
	//ctx.beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	//ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	//ctx.lineTo( this.x+screen.xOffset, this.y+screen.yOffset );
	ctx.fillStyle = "#B21";
	ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ');';
	//ctx.beginPath();
	//ctx.arc(this.x+screen.xOffset,this.y+screen.yOffset, 9, 0, 2 * Math.PI, false);
	ctx.fillRect(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 2, 2);
	//ctx.fill();
};

Particle.prototype.update = function() {
	if (!Game.settings.particles) return;
	this.coordinates.pop();
	this.coordinates.unshift([this.x, this.y]);
	this.x += Math.cos(this.angle) * this.speed;
	this.y += Math.sin(this.angle) * this.speed;
	this.alpha *= this.decay;
	this.speed *= this.friction;
	this.timeAlive++;
	if (this.timeAlive >= this.lifeTime) {
		Game.particles.deleteParticle(this);
	}
};//player.js

function Player() {
	Game.entities.push(this);
	this.x = 900;
	this.y = 900;
	this.health = 100;
	this.rotation = 0;
	this.lastUpdate = 0;
	this.sprite = new Sprite("images/player.png");
	this.width = 18;
	this.height = 18;
	this.scale = 1;
	this.rotation = 180;
	this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
	this.layer = 4;
	this.gun = null;
	this.lastGunDrop = 0;
	this.hasFlashlight = true;
	this.lastHealthRegen = 0;
	this.flashlight = true;
	this.lastFlashlightToggle = 0;
	this.batteryPower = 100;
	this.kills = 0;
	this.gameTime = 0;
}

Player.prototype.update = function() {
	this.boundingBox.update(this.x + (this.width / 2) - 18, this.y + (this.height / 2) - 18);
	if (Game.input.mouse.down) this.fire();
	if ((this.lastUpdate - getCurrentMs()) < -0.65) {
		if (this.flashlight) {
			this.batteryPower -= 1;
			if (this.batteryPower <= 0) {
				this.batteryPower = 0;
				this.flashlight = false;
			}
			this.lastUpdate = getCurrentMs();
		}
	}
	if ((this.lastHealthRegen - getCurrentMs()) < -2) {
		this.health++;
		if (this.health > 100) this.health = 100;
		this.lastHealthRegen = getCurrentMs();
	}
};

Player.prototype.render = function() {
	this.rotation = Math.atan2(this.y + Game.screen.yOffset - (this.height / 2) - Game.input.mouse.y, this.x + Game.screen.xOffset - (this.width / 2) - Game.input.mouse.x) * (180 / Math.PI);
	if (this.rotation < 0) {
		this.rotation += 360;
	}
	this.rotation -= 90;
	this.sprite.rotation = this.rotation;
	this.sprite.renderOnScreen(this.x, this.y);

	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 2, 2);

	if (this.gun === null) this.sprite.xOffset = 0;
	else if (this.gun !== null) {
		if (this.gun.reloading) this.sprite.xOffset = 0;
		else this.sprite.xOffset = 16;
	}

	if (this.x > 300 && this.x + 300 < Game.screen.maxXOffset * -1) Game.screen.xOffset = -(this.x - 300);
	if (this.y > 225 && this.y + 225 < Game.screen.maxYOffset * -1) Game.screen.yOffset = -(this.y - 225);

	if (Game.screen.xOffset > 0) Game.screen.xOffset = 0;
	if (Game.screen.yOffset > 0) Game.screen.yOffset = 0;
};

Player.prototype.fire = function() {
	if (this.gun !== null) {
		if (new Point(this.x, this.y).getDist(new Point(Game.input.mouse.x - Game.screen.xOffset - Game.screen.xOffset, Game.input.mouse.y - Game.screen.yOffset - Game.screen.yOffset)) > 30) {
			this.gun.fire();
		}
	}
};

Player.prototype.reloadWeapon = function() {
	if (this.gun !== null) {
		if (this.gun.ammo > 0)
			this.gun.reloadGun();
	}
};

Player.prototype.toggleFlashlight = function() {
	if (this.hasFlashlight) {
		if ((this.lastFlashlightToggle - getCurrentMs()) < -0.2) {
			if (this.flashlight) this.flashlight = false;
			else if (this.batteryPower > 0) this.flashlight = true;
			this.lastFlashlightToggle = getCurrentMs();
		}
	} else this.flashlight = false;
};

Player.prototype.takeDamage = function(amount) {
	Game.sound.playHurtSound();
	Game.particles.createBloodParticles(this.x, this.y);
	this.health -= amount;
	if (this.health <= 0) {
		this.health = 0;
		Game.gameOver();
	}
};

Player.prototype.drop = function() {
	if (this.gun !== null) {
		if ((this.lastGunDrop - getCurrentMs()) < -0.6) {
			this.gun.drop();
			this.lastGunDrop = getCurrentMs();
		}
	}
};

Player.prototype.use = function() {
	//Interact with environment? Maybe not...
};

Player.prototype.move = function(xm, ym) {
	if (!Game.inGame) return;
	xm *= 1;
	ym *= 1;

	var canMove = true;
	for (var x = 0; x < Game.level.width; x++) {
		for (var y = 0; y < Game.level.height; y++) {
			if (Game.level.tiles[x][y].solid) {
				if (this.boundingBox.wouldCollide(xm, ym, Game.level.tiles[x][y])) {
					canMove = false;
				}
			}
		}
	}
	for (var i = 0; i < Game.entities.length; i++) {
		if (Game.entities[i] instanceof Zombie) {
			if (this.boundingBox.wouldCollide(xm, ym, Game.entities[i])) {
				canMove = false;
			}
		}
	}
	if (canMove) {
		this.x += xm;
		this.y += ym;
	}
};function PlayerSpawn(x, y) {
	this.x = x;
	this.y = y;
	Game.entities.push(this);
}

PlayerSpawn.prototype.render = function() {

};

PlayerSpawn.prototype.update = function() {
	if (Game.inGame) {
		if (Game.player instanceof Player) {
			Game.player.x = this.x + 16;
			Game.player.y = this.y + 16;
		}
		Game.deleteEntity(this);
	}
};//point.js

function Point(x,y) {
	this.x = x;
	this.y = y;
}

Point.prototype.getDist = function(point) {
	var xs = 0;
	var ys = 0;

	xs = point.x - this.x;
	xs = xs * xs;

	ys = point.y - this.y;
	ys = ys * ys;

	return Math.sqrt( xs + ys );
};
function Screen() {
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 600;
	this.height = 450;
	this.maxXOffset = Game.level.width * 32 * -1;
	this.maxYOffset = Game.level.height * 32 * -1;
}

Screen.prototype.scroll = function() {
	this.move(0, 0);
};

Screen.prototype.move = function(x, y) {
	if (x < 0) {
		if (this.xOffset + x > this.maxXOffset + this.width) {
			this.xOffset += x;
		}
	} else if (x > 0) {
		if (this.xOffset + x < 0) {
			this.xOffset += x;
		}
	}
	if (y < 0) {
		if (this.yOffset + y > this.maxYOffset + this.height) {
			this.yOffset += y;
		}
	} else if (y > 0) {
		if (this.yOffset + y < 0) {
			this.yOffset += y;
		}
	}
};

Screen.prototype.setOffset = function(x, y) {
	if (x > this.maxXOffset) x = this.maxXOffset;
	if (y > this.maxYOffset) y = this.maxYOffset;
	if (x > 0) x = 0;
	if (y > 0) y = 0;
	this.xOffset = x;
	this.yOffset = y;
};function Settings() {
	this.sound = true;
	this.particles = true;
}

Settings.prototype.toggle = function(str) {

};//Using audiofx.min.js



function SoundManager() {
	this.zombieSounds = [];
	this.hurtSounds = [];
	this.gunSounds = [];

	this.totalAssets = 29;
	this.guns = {
		pistol: 0,
		shotgun: 1,
		smg: 2,
		machinegun: 3,
		pickup: 4,
		drop: 5,
		reload: 6
	};

	if (AudioFX.supported) {
		this.gunSounds[this.guns.pistol] = AudioFX('sounds/gunshot3', {
			formats: ['wav'],
			pool: 8,
			volume: 0.3
		});
		this.gunSounds[this.guns.shotgun] = AudioFX('sounds/gunshot2', {
			formats: ['wav'],
			pool: 8,
			volume: 0.3
		});
		this.gunSounds[this.guns.smg] = AudioFX('sounds/gunshot4', {
			formats: ['wav'],
			pool: 12,
			volume: 0.1
		});
		this.gunSounds[this.guns.pickup] = AudioFX('sounds/gun_pickup', {
			formats: ['wav'],
			pool: 2,
			volume: 0.5
		});
		this.gunSounds[this.guns.drop] = AudioFX('sounds/gun_drop', {
			formats: ['wav'],
			pool: 2,
			volume: 0.5
		});
		this.gunSounds[this.guns.reload] = AudioFX('sounds/gun_reload', {
			formats: ['wav'],
			pool: 3,
			volume: 0.5
		});
		this.ambience1 = AudioFX('sounds/eerie_loop', {
			formats: ['wav'],
			volume: 0,
			autoplay: false,
			loop: true
		});
		this.load();
	} else console.log("Browser does not support AudioFX (likely html5 audio unsupported)");
}

SoundManager.prototype.load = function() {
	var onload = function() {
		Game.loader.assetsLoaded++;
		console.log("Sound asset loaded")
	};
	for (var i = 1; i <= 28; i++) {
		var str = 'zombie-' + i;
		this.zombieSounds[i] = AudioFX('sounds/zombies/' + str, {
			formats: ['wav'],
			pool: 4,
			volume: 0.2
		}, onload);
	}
	for (var i = 1; i < 3; i++) {
		this.hurtSounds[i] = AudioFX('sounds/hurt_' + i, {
			formats: ['wav'],
			pool: 2,
			volume: 0.5
		}, onload);
	}
	setTimeout("Game.loader.assetsLoaded +=" + this.totalAssets, 300);
};

SoundManager.prototype.playZombieSound = function(hurt) {
	if (!Game.settings.sound) return;
	var rand;
	if (hurt) {
		rand = Math.floor(Math.random() * 14);
		if (this.zombieSounds[rand] !== undefined) this.zombieSounds[rand].play();
	} else {
		rand = Math.floor(Math.random() * 13) + 14;
	}
	if (this.zombieSounds[rand] !== undefined) {
		if (this.zombieSounds[rand] !== undefined) this.zombieSounds[rand].play();
	}
};

SoundManager.prototype.playHurtSound = function() {
	if (!Game.settings.sound) return;
	var rand;
	rand = Math.floor(Math.random() * 3) + 1;
	if (Game.sound.hurtSounds[rand] !== undefined)
		Game.sound.hurtSounds[rand].play();
};

SoundManager.prototype.playGunSound = function(num) {
	if (!Game.settings.sound) return;
	this.gunSounds[num].play();
};function Sprite(img) {
	this.img = new Image();
	this.img.src = img;
	this.scale = 1;
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 1;
	this.height = 1;
	this.rotation = 0;
	this.frameWidth = 16;
	this.frameHeight = 16;
	this.loaded = false;
	this.rotation = 0;
	this.alpha = 1;
	this.fadeAmount = 0;
	this.rotationXOffset = 0;
	this.rotationYOffset = 0;
	var _this = this;
	this.img.onload = function() {
		_this.loaded = true;
		_this.width = _this.img.width;
		_this.height = _this.img.height;
	};
}

Sprite.prototype.render = function(x, y) {
	ctx.drawImage(this.img, this.xOffset, this.yOffset, this.width, this.height, x, y, this.width * this.scale, this.width * this.scale);
};
Sprite.prototype.renderOnScreen = function(x, y) {
	if (!this.loaded) return;
	//Check if the entity is on Game.screen, and draw if so
	if (x + Game.screen.xOffset < Game.screen.width && x + Game.screen.xOffset > 0) {
		if (y + Game.screen.yOffset < Game.screen.height && y + Game.screen.yOffset > 0) {
			this.drawImage(x + Game.screen.xOffset, y + Game.screen.yOffset);
		}
	}
};

Sprite.prototype.drawImage = function(x, y) {
	if (this.fadeAmount !== 0) {
		this.alpha += this.fadeAmount;
		if (this.alpha >= 1) {
			this.fadeAmount = 0;
			if (this.onFadeIn !== undefined) this.onFadeIn();
			this.alpha = 1;
		}
		if (this.alpha <= 0) {
			this.fadeAmount = 0;
			if (this.onFadeOut !== undefined) this.onFadeOut();
			this.alpha = 0;
		}
	}
	ctx.save();
	ctx.translate(x + this.rotationXOffset, y + this.rotationYOffset);
	ctx.rotate(degToRad(this.rotation));
	ctx.globalAlpha = this.alpha;
	ctx.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth * this.scale, this.frameWidth * this.scale);
	ctx.restore();
};

Sprite.prototype.fadeOut = function(callback) {
	this.onFadeOut = callback;
	this.fadeAmount = -0.05;
};

Sprite.prototype.fadeIn = function(callback) {
	this.onFadeIn = callback;
	this.fadeAmount = 0.05;
};var tileSheet = new Image();
tileSheet.src = "images/tilesheet.png";

function Tile(x, y, id) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.boundingBox = new BoundingBox(this.x, this.y, 32, 32);
	this.color = '#060';
	if (this.id <= 16) this.solid = true;
}

Tile.prototype.setColor = function(color) {
	this.color = color;
};

Tile.prototype.render = function() {
	var xOffset = ((this.id - 1) % 4) * 32;
	var yOffset = Math.floor(((this.id - 1) / 4)) * 32;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 32, 32);
	ctx.drawImage(tileSheet, xOffset, yOffset, 32, 32, this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 32, 32);
};

function isSolidTile(x, y) {
	if (Game.level.tiles[x][y] === undefined) return;
	if (Game.level.tiles[x][y] === null) return;
	if (Game.level.tiles[x][y].solid) return true;
	else return false;
}/**
 * tmx-loader.js  - A Javascript loader for the TMX File Format.
 *
 * 	Currenty Supports: 
 *						- Map
 *						- Layers
 *						- Tile Data (CSV only)
 *
 * 	Depends on: Jquery for file loading and XML parsing
 *
 */
 
var tmxloader = {}

tmxloader.trim  = function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

tmxloader.Map = function(width,height,tileWidth,tileHeight,layers,properties){
	this.width = width;
	this.height = height;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.tilesets = new Array();
	this.layers = new Array(layers);
	this.properties = properties;
}

tmxloader.Tileset = function(firstgid, name, tileWidth,tileHeight,src,width,height,properties){
	this.firstGid = firstgid;
	this.name = name;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.src = src;
	this.width = width;
	this.height = height;
	this.properties = properties;
}

tmxloader.Layer = function(layerName,width,height,properties){
	this.name = layerName;
	this.width = width;
	this.height = height;
	this.data  = new Array(height);
	this.properties = properties;
	
	for(var d = 0;d < height;++d){
		this.data[d] = new Array(width);
	}
	
	this.loadCSV = function(data){
		var layerData = tmxloader.trim(data).split('\n');		
		for(var x = 0; x <layerData.length; ++x){
			var line = tmxloader.trim(layerData[x]);
			var entries = line.split(',');
			for(var e = 0;e <width;++e){
				this.data[x][e] = entries[e];
			}
		}
	}	
}

tmxloader.Object = function(objectname, type, x, y, width, height,properties){
	this.name = objectname;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.type  = type;
	this.properties = properties;
}


tmxloader.ObjectGroup = function(groupname,width,height,properties){
	this.name = groupname;
	this.width = width;
	this.height = height;
	this.objects  = new Array();
	this.properties = properties;
}

tmxloader.parseProperties = function($xml){
     var properties = new Array();
	 $xml.find('properties:first ').each(function(){	
	 	$xml.find('property').each(function(){	
	 		console.log("Processing Property: " + $(this).attr("name") + " =  "+  $(this).attr("value"));
	 		properties[''+$(this).attr("name")+''] = $(this).attr("value");
	 	});
	 });
	 return properties;
}

tmxloader.load = function(url){

		var result;
		 $.ajax({
		    url: url,
		    type: 'get',
		    dataType: 'html',
		    async: false,
		    success: function(data) {
		        result = data;
		    } 
		 });

		 var xmlDoc = jQuery.parseXML( result );
		 $xml = $(xmlDoc);
		 $version = $xml.find("map").attr("version");
		 console.log('Parsing...' + $version);
		 $width = $xml.find("map").attr("width");
		 $height = $xml.find("map").attr("height");
		 
		 $tilewidth = $xml.find("map").attr("tilewidth");
		 $tileheight = $xml.find("map").attr("tileheight");
		 var properties = tmxloader.parseProperties($xml);
		 tmxloader.map = new tmxloader.Map($width,$height,$tilewidth,$tileheight, $xml.find('layer').length,properties);
		 
		 console.log('Creating Map...' +  tmxloader.map.width + " x " + tmxloader.map.height + " Tiles: " +  tmxloader.map.tileWidth + " x " +  tmxloader.map.tileHeight);
		 
		 console.log("Found " + $xml.find('layer').length + " Layers");
		 var layerCount = 0;
		 $xml.find('layer').each(function(){			
			console.log("Processing Layer: " + $(this).attr("name"));
			$data = $(this).find("data");
			
			$lwidth = $(this).attr("width");
		 	$lheight = $(this).attr("height");
		 	var properties = tmxloader.parseProperties($(this));
		 	tmxloader.map.layers[layerCount] = new tmxloader.Layer($(this).attr("name"),$lwidth,$lheight,properties);
		
			if($data.attr("encoding") =="csv"){
				console.log("Processing CSV");
				var eData = $data.text();
				tmxloader.map.layers[layerCount].loadCSV(eData);
				
			} else {
				console.log("Unsupported Encoding Scheme");
			}
			
			
			
			++layerCount;
		
		 });
		 
		$xml.find('tileset').each(function(){	
			 $firstgid = $(this).attr("firstgid");
			 $name = $(this).attr("name");
			 $tilewidth = $(this).attr("tilewidth");
			 $tileheight = $(this).attr("tileheight");
			 
				$image =  $(this).find('image');
				$src = $image.attr("source");
				$width = $image .attr("width");
			 	$height = $image .attr("height"); 
			 	var properties = tmxloader.parseProperties($(this));
			 tmxloader.map.tilesets.push(new tmxloader.Tileset($firstgid,$name,$tilewidth,$tileheight,$src,$width,$height,properties));
		 });
		 
		 $xml.find('objectgroup').each(function(){	
		 
		 		

			$lwidth = $(this).attr("width");
		 	$lheight = $(this).attr("height");
		 	$numobjects =  $(this).find('object').length;
		 	tmxloader.map.objectgroup = new Object();
		 	console.log("Processing Object Group: " + $(this).attr("name") + " with " + $numobjects + " Objects");
		 	var properties = tmxloader.parseProperties($(this));
		 	tmxloader.map.objectgroup[''+$(this).attr("name")+''] = new tmxloader.ObjectGroup($(this).attr("name"),$lwidth,$lheight,properties);
		
			$objectGroupName = $(this).attr("name");
				 $xml.find('object').each(function(){
				 	$objectname =  $(this).attr("name");
				 	$objecttype =  $(this).attr("type");
				 	$objectx = $(this).attr("x");
				 	$objecty = $(this).attr("y");
				 	$objectwidth = $(this).attr("width");
				 	$objectheight = $(this).attr("height");
				 	console.log("Processing Object: " + $objectname);
				 	var properties = tmxloader.parseProperties($(this));
				 	tmxloader.map.objectgroup[''+$objectGroupName+''].objects.push(new tmxloader.Object($objectname, $objecttype , $objectx, $objecty, $objectwidth,  $objectheight,properties) );
				 });

		 } );
		 
}	
function UI() {
	this.alert = "";
	this.gameOver = false;
	this.gameOverImg = new Image();
	this.gameOverImg.src = "images/gameover2.png";
	this.loadingPercent = 0;
}

UI.prototype.draw = function() {
	ctx.textAlign = 'center';

	ctx.fillStyle = "#F00";
	ctx.font = 'normal 20px arial';
	//ctx.fillText(this.alert, canvas.width/2,canvas.height/4);
	if (this.gameOver) ctx.drawImage(this.gameOverImg, (canvas.width / 2) - this.gameOverImg.width / 2, canvas.height / 4);

	this.drawStats(3, 15);

	this.drawGun(375, 430);

	this.drawHealth(50, 420);

	this.drawBattery(170, 420);

};

UI.prototype.drawLoadingScreen = function() {
	this.loadingPercent += (Game.loader.getLoadPercent() - this.loadingPercent) * 0.1;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//ctx.fillText(this.alert, canvas.width/2,canvas.height/4);
	ctx.textAlign = 'center';
	ctx.fillStyle = "#FFF";
	ctx.font = 'normal 20px arial';
	ctx.fillText("Loading...", canvas.width / 2, canvas.height / 4);
	ctx.fillRect(100, canvas.height / 3, this.loadingPercent * 3, 30);
	ctx.fillText(Math.floor(Game.loader.getLoadPercent()) + "%", canvas.width / 2, canvas.height / 2);
};

UI.prototype.drawStats = function(x, y) {
	ctx.textAlign = 'left';
	ctx.font = 'normal 16px arial';
	ctx.fillStyle = "#FFF";
	ctx.fillText("Kills: " + Game.player.kills, x, y);
	ctx.fillText("Time: " + Game.level.levelTime, x, y + 20);
};

UI.prototype.drawBattery = function(x, y) {
	ctx.textAlign = 'left';
	ctx.font = 'normal 16px arial';
	ctx.strokeStyle = "#666";
	ctx.lineWidth = 1;
	ctx.strokeRect(x, y, 96, 26);
	ctx.fillStyle = "#0C0";
	//ctx.fillRect(x+2,y+2,player.batteryPower,20);
	for (var i = 0; i < Game.player.batteryPower / 10; i++) {
		ctx.fillRect(x + 3 + (i * 9), y + 3, 8, 20);
	}
	ctx.fillStyle = "#FFF";
	ctx.fillText("Flashlight", x, y - 5);
};

UI.prototype.drawHealth = function(x, y) {
	ctx.textAlign = 'left';
	ctx.font = 'normal 16px arial';
	ctx.fillText("Health", x, y - 5);
	ctx.strokeStyle = "#666";
	ctx.lineWidth = 1;
	ctx.strokeRect(x, y, 106, 26);
	ctx.fillStyle = "#0C0";
	ctx.fillRect(x + 3, y + 3, Game.player.health, 20);
	ctx.fillStyle = 'rgba(' + 255 + ',' + 0 + ',' + 0 + ',' + (1 - (Game.player.health / 100)) + ');';
	ctx.fillRect(x + 3, y + 3, Game.player.health, 20);
};

UI.prototype.drawGun = function(x, y) {
	ctx.textAlign = 'left';
	ctx.font = 'normal 18pt Calibri';
	ctx.fillStyle = "#FFF";

	var gunname;
	var gunammo;
	var gunclipammo;
	var gunclipmax;
	if (Game.player.gun !== null) {
		gunname = Game.player.gun.displayName;
		gunammo = Game.player.gun.ammo;
		gunclipammo = Game.player.gun.clipAmmo;
		gunclipmax = Game.player.gun.clipSize;
	} else {
		gunname = "Unarmed";
		gunammo = 0;
		gunclipammo = 0;
		gunclipmax = 0;
	}
	ctx.fillText(gunname + " " + gunclipammo + "/" + gunammo, x + 0, y + 10);
};
UI.prototype.handleInput = function() {
	//Onclick handler

};//Zombie.js

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
		this.isDying = true;
		this.deathRotation = this.rotation;
		this.sprite.fadeOut();
		this.layer = 0;
		this.boundingBox.setHeight(0);
		this.boundingBox.setWidth(0);
		Game.sound.playZombieSound(true);
	}
};function ZombieSpawner(x, y) {
	this.x = x;
	this.y = y;
	this.lastSpawn = 0;
	this.spawned = 0;
	this.spawnRate = 8;
	this.maxNearbyZombies = 6;
	Game.entities.push(this);
}

ZombieSpawner.prototype.render = function() {

};

ZombieSpawner.prototype.update = function() {
	var deconds = Math.floor(Game.level.levelTime / 10);
	this.spawnRate = 8 - Math.floor(deconds / 3); //For every 20 seconds decrease by 1
	this.maxNearbyZombies = 6 + Math.floor(deconds / 5); //For every 50 seconds, add 1 to max zombies
	if (this.spawnRate < 1) this.spawnRate = 1;

	if (getCurrentMs() - this.lastSpawn > this.spawnRate) { //Spawns slow down for each spawn..
		var distToPlayer = new Point(this.x, this.y).getDist(new Point(Game.player.x, Game.player.y));
		if (distToPlayer > 275 && distToPlayer < 800) {
			var canSpawn = true;
			var nearbyZombies = 0;
			for (var i = 0; i < Game.entities.length; i++) {
				if (Game.entities[i] instanceof Zombie) {
					var distToSpawner = new Point(this.x, this.y).getDist(new Point(Game.entities[i].x, Game.entities[i].y));
					if (distToSpawner < 28) canSpawn = false;
					if (distToSpawner < 400) {
						nearbyZombies++;
					}
				}
			}
			if (nearbyZombies > this.maxNearbyZombies) canSpawn = false;
			if (canSpawn) {
				new Zombie(this.x, this.y);
				this.spawned++;
				this.lastSpawn = getCurrentMs();
			}
		}
	}
};