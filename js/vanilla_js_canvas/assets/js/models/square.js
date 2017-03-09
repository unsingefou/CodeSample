function Square(xpos, ypos, width, height, color, context) {
  this.xpos = xpos;
  this.ypos = ypos;
  this.width = width;
  this.height = height;
  this.color = color;
  this.context = context;
  this.selected = false;
}

Square.prototype.checkHit = function(layerX, layerY) {
  if (layerX > this.xpos && layerX < (this.xpos + this.width) && layerY > this.ypos && layerY < (this.ypos + this.height)) {
    this.selected = true;
  }
}

Square.prototype.draw = function() {
  this.context.fillStyle = this.color
  this.context.fillRect(this.xpos, this.ypos, this.width, this.height)
}

Square.prototype.centerOnCursor = function(layerX, layerY) {
  this.xpos = layerX - (this.width * 0.5);
  this.ypos = layerY - (this.height * 0.5);
}
