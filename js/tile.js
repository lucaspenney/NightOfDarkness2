//tile.js

var r=0,g=0,b=0;
var tileSheet = new Image();
tileSheet.src = "images/tilesheet.png";

function Tile(x, y, id) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.boundingBox = new BoundingBox(this.x,this.y,32,32);
	this.color = '#060';
	if (this.id <= 16) this.solid = true;
}

Tile.prototype.setColor = function(color) {
	this.color = color;
};

Tile.prototype.render = function() {
	//if (new Point(this.x,this.y).getDist(new Point(player.x,player.y)) < 550) {

	var xOffset = ((this.id - 1) % 4) * 32;
	var yOffset = Math.floor(((this.id - 1) / 4)) * 32;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 32, 32);
	ctx.drawImage(tileSheet, xOffset, yOffset, 32, 32, this.x + Game.screen.xOffset, this.y + Game.screen.yOffset, 32, 32);
	//}
};

function isSolidTile(x,y) {
	if (game.level.tiles[x][y] === undefined) return;
	if (game.level.tiles[x][y] === null) return;
	if (game.level.tiles[x][y].solid) return true;
	else return false;
}
