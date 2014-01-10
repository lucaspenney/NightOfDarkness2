function Inventory() {
	this.items = [];
	this.items[0] = null;
	this.selectedItem = 1;
	this.size = 6;
}

Inventory.prototype.useItem = function(index) {
	if (this.items[index]) {
		this.items[index].use();
		this.removeItem(this.items[index]);
		this.selectedItem = this.items.length-1;
	}
};

Inventory.prototype.selectItemSlot = function(num) {
	if (num > 0 && num <= this.size) {
		if (this.items[num] !== undefined && this.items[num] !== null) {
			this.selectedItem = num;
		}
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
	if (this.items[this.selectedItem] === undefined || this.items[this.selectedItem] === null) {
		this.selectedItem = this.items.length-1;
	}
};