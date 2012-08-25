function Color(hex, alpha){
	this.r = this.g = this.b = 0;
	this.alpha = alpha === undefined ? 1 : alpha;
	if(hex !== undefined)
		this.setHex(hex);
	return this;
}
Color.prototype.setHex = function(hex) {
	this.r = hex >> 16 & 255;
	this.g = hex >> 8 & 255;
	this.b = hex & 255;
};
Color.prototype.getRGB = function() {
	return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
};
Color.prototype.getRGBA = function(alpha) {
	alpha = alpha === undefined ? this.alpha : alpha;
	return "rgba(" + this.r + "," + this.g + "," + this.b + ","+ alpha +")";
};
Color.prototype.add = function(color) {
	this.r = (this.r + color.r) & 255;
	this.g = (this.g + color.g) & 255;
	this.b = (this.b + color.b) & 255;
};