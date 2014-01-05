function Inventory() {
	this.items = [];
	this.selectedItem = null;
	this.size = 3;
}

Inventory.prototype.useItem = function(index) {
	if (this.items[index]) {
		this.items[index].use();
		this.removeItem(this.items[index]);
		this.inventory.selectedItem = null;
	}
};

Inventory.prototype.addItem = function(item) {
	if (this.items.length < this.size) {
		this.items.push(item);
		return true;
	} else return false;
};


Inventory.prototype.removeItem = function(item) {
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i] === item) {
			this.items.splice(i, 1);
			break;
		}
	}
};