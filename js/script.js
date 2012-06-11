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
    var bookImgObj = new Image();
    var that = this;
    bookImgObj.onload = function() {
       var image = new Kinetic.Image({
            x: 0,
            y: 0,
            width: that.book.getWidth(),
            height: that.book.getHeight(),
            image: bookImgObj
        });
       that.layer.add(image);
       that.layer.draw();
    }
    bookImgObj.src = "svg/book.svg";
}