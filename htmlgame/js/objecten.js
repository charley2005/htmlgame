class Sprite {
  constructor(posX, posY, speedX, speedY, width, height, url,) {
    this.x = posX;
    this.y = posY;
    this.speedX = speedX;
    this.speedY = speedY;
    this.width = width;
    this.height = height;
    this.rotation = 0;
    this.url = url;
    this.image = new Image();
    this.alive = true;
    this.bullets = [];
    this.lastBulletTime = Date.now();
    this.bulletInterval = Math.random() * 3000 + 3000;
    if (typeof url !== "undefined") {
      this.image.src = url;
    } else {
      console.warn("url is undefined");
    }

    

  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.type === "enemie2"){
      this.x += Math.sin(this.y / 30) * 1;
    }if(this.type === "enemie3"){
      this.dropBullet();
    }
    
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  dropBullet() {
    if (Date.now() - this.lastBulletTime > this.bulletInterval) { // Use this.bulletInterval instead of this.bulletinterval
      const bullet = new Sprite(this.x, this.y + this.height, 0, 0.2, 10, 10, "images/enemybullet.png");
      bullet.type = "bullet";
      this.bullets.push(bullet);
      this.lastBulletTime = Date.now();
      this.bulletInterval = Math.random() * 3000 + 3000; // Random interval between 3 and 6 seconds
    }
  }
}