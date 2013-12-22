
var particles = [];

//YAY PARTICLES!!!!!!!!!!!!!!!!!11!!!!one!!!!1!!

function Particle(x,y,r,g,b,angle,speed,friction,alpha,decay, lifetime) {
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
		this.coordinates.push([this.x,this.y]);
	}
	particles.push(this);
}

Particle.prototype.render = function() {
	if (!game.particles) return;
	//ctx.beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	//ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	//ctx.lineTo( this.x+screen.xOffset, this.y+screen.yOffset );
	ctx.fillStyle = "#B21";
	ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha  + ');';

	//ctx.beginPath();
	//ctx.arc(this.x+screen.xOffset,this.y+screen.yOffset, 9, 0, 2 * Math.PI, false);
	ctx.fillRect(this.x+screen.xOffset,this.y+screen.yOffset, 2,2);
	//ctx.fill();
};

Particle.prototype.update = function() {
	if (!game.particles) return;
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed;
	this.alpha *= this.decay;
	this.speed *= this.friction;
	this.timeAlive++;
	if (this.timeAlive >= this.lifeTime) {
		deleteParticle(this);
	}
};

function createBloodParticles(x,y) {
	var particleCount = Math.floor((Math.random() * 25)) + 5;
	while( particleCount-- ) {
		particles.push( new Particle( x,y,122,7,1,random(0, Math.PI * 2),random(0.3,2.5),0.8,0.9, 0.9, 30 ) );
	}
}

function random(low, high) {
	var rand = (Math.random() * high) + low;
	return rand;
}

function drawParticles() {
	for (var i=0;i<particles.length;i++) {
		particles[i].render();
		particles[i].update();
	}
}

function deleteParticle(p) {
	for (var i=0;i<particles.length;i++) {
		if (particles[i] == p) {
			particles.splice(i, 1);
			break;
		}
	}
}
