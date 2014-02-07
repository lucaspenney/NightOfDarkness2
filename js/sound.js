//Using audiofx.min.js



function SoundManager() {
	this.zombieSounds = [];
	this.hurtSounds = [];
	this.gunSounds = [];
	this.totalAssets = 40;

	if (AudioFX.supported) {
		this.load();
	} else console.log("Browser does not support AudioFX (likely html5 audio unsupported)");
}

SoundManager.prototype.load = function() {
	var onload = function() {
		Game.loader.assetsLoaded++;
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
	this.guns = {
		pistol: 0,
		shotgun: 1,
		smg: 2,
		revolver: 3,
		machinegun: 4,
		pickup: 5,
		drop: 6,
		reload: 7
	};
	this.gunSounds[this.guns.pistol] = AudioFX('sounds/gunshot3', {
		formats: ['wav'],
		pool: 8,
		volume: 0.3
	}, onload);
	this.gunSounds[this.guns.shotgun] = AudioFX('sounds/gunshot2', {
		formats: ['wav'],
		pool: 8,
		volume: 0.3
	}, onload);
	this.gunSounds[this.guns.revolver] = AudioFX('sounds/gunshot3', {
		formats: ['wav'],
		pool: 8,
		volume: 0.3
	}, onload);
	this.gunSounds[this.guns.machinegun] = AudioFX('sounds/gunshot3', {
		formats: ['wav'],
		pool: 30,
		volume: 0.3
	}, onload);
	this.gunSounds[this.guns.smg] = AudioFX('sounds/gunshot4', {
		formats: ['wav'],
		pool: 12,
		volume: 0.1
	}, onload);
	this.gunSounds[this.guns.pickup] = AudioFX('sounds/gun_pickup', {
		formats: ['wav'],
		pool: 2,
		volume: 0.5
	}, onload);
	this.gunSounds[this.guns.drop] = AudioFX('sounds/gun_drop', {
		formats: ['wav'],
		pool: 2,
		volume: 0.5
	}, onload);
	this.gunSounds[this.guns.reload] = AudioFX('sounds/gun_reload', {
		formats: ['wav'],
		pool: 3,
		volume: 0.5
	}, onload);
	this.backgroundMusic = AudioFX('sounds/background', {
		formats: ['wav'],
		pool: 1,
		volume: 0.1,
		loop: true
	}, onload);
	this.waveSound = AudioFX('sounds/creepybreath', {
		formats: ['wav'],
		pool: 2,
		volume: 0.2,
	}, onload);
	this.footstepSound = AudioFX('sounds/footstep', {
		formats: ['wav'],
		pool: 1,
		volume: 0.2
	}, onload);
	this.itemPickUp = AudioFX('sounds/itempickup', {
		formats: ['wav'],
		pool: 2,
		volume: 0.2
	}, onload);
	this.flashlight = AudioFX('sounds/flashlight', {
		formats: ['wav'],
		pool: 2,
		volume: 0.3
	}, onload);
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
};