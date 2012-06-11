function bookJs(containerId, w, h) {
    this.book = new Kinetic.Stage({
        container: containerId,
        width: w,
        height: h,
    });
    this.layer = new Kinetic.Layer();
    this.book.add(this.layer);
}

bookJs.prototype.drawBook = function() {
    var rect = new Kinetic.Rect({
       x: 0,
       y: 0,
       width: this.book.attrs['width'],
       height: this.book.attrs['height'],
       fill: "cyan",
       stroke: "black",
       strokeWidth: 4
    });
    this.layer.add(rect);
    this.layer.draw();
}

bookJs.prototype.drawCircle = function() {
    var circle = new Kinetic.Circle({
        x: this.book.getWidth() /2,
        y: this.book.getHeight() /2,
        radius: 100,
        fill: "blue",
        stroke: "black",
        strokeWidth: 4,
        draggable: true
    });
    this.layer.add(circle);
    this.layer.draw();
}