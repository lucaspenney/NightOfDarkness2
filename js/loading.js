function AssetLoader() {
	//this.callback = callback;
	this.assets = [
		"images/mainmenu.png",
		"images/tilesheet.png",
		"images/hud.png",
		"images/inventory_selected.png",
		"images/gameover.png",
		"images/flashlight_large.png",
		"images/items.png",
		"images/muzzleflash.png",
		"images/player.png",
		"images/zombie.png",
		"images/flashlight.png",
		"images/pistol.png",
		"images/smg.png",
		"images/shotgun.png",
		"images/machinegun.png",
		"images/revolver.png",
		"images/flare.png",

	];
	this.assetsLoaded = 0;
	this.totalAssets = 1;
}

AssetLoader.prototype.load = function() {
	this.totalAssets = 55;
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
};