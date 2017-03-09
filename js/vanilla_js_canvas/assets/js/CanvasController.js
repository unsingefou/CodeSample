function CanvasController() {
  this.canvas = document.getElementById("mainCanvas");
  this.ctx = this.canvas.getContext("2d");
  this.isMouseDown = false;

  this.square = new Square(this.canvas.width * 0.5 - 20, this.canvas.height * 0.5 - 20, 40, 40, "#7ca6ea", this.ctx);

  this.init = function() {
    this.update();
    this.canvas.onmousedown = this.mouseDown.bind(this);
    this.canvas.onmouseup = this.mouseUp.bind(this);
    this.canvas.onmousemove = this.mouseMove.bind(this);
  }
}

CanvasController.prototype.update = function() {
  var self = this;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.square.draw()
  setTimeout(function(){self.update()}, 50);
}

CanvasController.prototype.mouseDown = function(e) {
  this.square.checkHit(e.layerX, e.layerY)
  this.isMouseDown = true;
}

CanvasController.prototype.mouseUp = function(e) {
  this.isMouseDown = false;
  this.square.selected = false;
}

CanvasController.prototype.mouseMove = function(e) {
  if(this.isMouseDown && this.square.selected) {
    this.square.centerOnCursor(e.layerX, e.layerY);
  }
}
