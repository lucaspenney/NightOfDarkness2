function FPSManager() {
	this.fps = 30;
	this.now = null;
	this.then = Date.now();
	this.interval = 1000 / this.fps;
	this.delta = null;
}