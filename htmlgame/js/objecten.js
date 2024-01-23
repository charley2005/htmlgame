class Sprite {
  constructor(posX, posY, speedX, speedY, width, height, url,) {
    this.x = posX;
    this.y = posY;
    this.speedX = speedX;
    this.speedY = speedY;
    this.width = width;
    this.height = height;
    this.url = url;
    this.image = new Image();
    this.rotation = 0;
    if (typeof url !== "undefined") {
      this.image.src = url;
    } else {
      console.warn("url is undefined");
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

