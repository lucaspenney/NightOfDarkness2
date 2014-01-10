function ParticleManager() {
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
	var particleCount = Math.floor((Math.random() * 25)) + 15;
	while (particleCount--) {
		this.particles.push(new Particle(x, y, 122, 7, 1, random(0, Math.PI * 2), random(0.3, 2.5), 0.8, 0.9, 0.9, 30));
	}
};

ParticleManager.prototype.createSparkParticles = function(x, y) {
	var particleCount = Math.floor((Math.random() * 5)) + 5;
	while (particleCount--) {
		this.particles.push(new Particle(x, y, 230, 230, 215, random(0, Math.PI * 2), random(1, 2.5), 0.5, 1.0, 0.6, 10, 1));
	}
};
/* Particle Object */

function Particle(x, y, r, g, b, angle, speed, friction, alpha, decay, lifetime, size) {
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
	this.size = size || 2;
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
	ctx.fillRect(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, this.size, this.size);
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
};