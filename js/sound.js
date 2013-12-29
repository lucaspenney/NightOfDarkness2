//Using audiofx.min.js



function SoundManager() {
	this.zombieSounds = [];
	this.hurtSounds = [];
	this.gunSounds = []; //Todo: move gun sounds into this array, currently they are below

	this.totalAssets = 29;

	console.log(this.hurtSound);

	if (AudioFX.supported) {
		//var shufflesound = AudioFX('sounds/cardshuffle', { formats: ['wav'], pool:2 });
		var gunshot_pistol = AudioFX('sounds/gunshot3', {
			formats: ['wav'],
			pool: 8,
			volume: 0.3
		});
		var gunshot_shotgun = AudioFX('sounds/gunshot2', {
			formats: ['wav'],
			pool: 8,
			volume: 0.3
		});
		var gunshot_smg = AudioFX('sounds/gunshot4', {
			formats: ['wav'],
			pool: 12,
			volume: 0.1
		});
		var gunpickup = AudioFX('sounds/gun_pickup', {
			formats: ['wav'],
			pool: 2,
			volume: 0.5
		});
		var gundrop = AudioFX('sounds/gun_drop', {
			formats: ['wav'],
			pool: 2,
			volume: 0.5
		});
		var gunreload = AudioFX('sounds/gun_reload', {
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

function playZombieSound(hurt) {
	if (!game.sound) return;
	var rand;
	if (hurt) {
		rand = Math.floor(Math.random() * 14);
		if (zombieSounds[rand] !== undefined) zombieSounds[rand].play();
	} else {
		rand = Math.floor(Math.random() * 13) + 14;
	}
	if (zombieSounds[rand] !== undefined) {
		if (zombieSounds[rand] !== undefined) zombieSounds[rand].play();
	}
}

function playHurtSound() {
	var rand;
	rand = Math.floor(Math.random() * 3) + 1;
	if (Game.sound.hurtSounds[rand] !== undefined)
		Game.sound.hurtSounds[rand].play();
}