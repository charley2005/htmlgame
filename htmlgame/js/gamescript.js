let ctx, canvaswidth, canvasheight;
const fps = 1000;
const frametime = 1000 / fps;
const Interval = 1000 / fps; // Define the Interval variable
canvaswidth = 800;
canvasheight = 600;




function start() {
  let volgende;
  (function gameloop(timestamp) {
    if (volgende === undefined) {
      volgende = timestamp;
    }
    const verschil = timestamp - volgende;
    if (volgende > Interval) {
      volgende = timestamp - (verschil % Interval);
      update();
      draw();
    }

    requestAnimationFrame(gameloop);
  })();
}

function init() {
  const canvas = document.getElementById("myCanvas");
  canvas.width = canvaswidth;
  canvas.height = canvasheight;
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvaswidth, canvasheight);
  Sprite1 = new Sprite(300, 500, 0, 0, 50, 50, 'images/ship.png');
  Sprite2 = new Sprite(300, 10, 0, 0, 50, 50, 'images/enemy.png',); 
  start();
}
function update() {
  
  
const sprites = [Sprite1, Sprite2, ];
  sprites.forEach(sprite => {
    sprite.update();
  });
}

function draw() {
  ctx.clearRect(0, 0, canvaswidth, canvasheight);
  
  const sprites = [Sprite1, Sprite2, ];
  sprites.forEach(sprite => {
    sprite.draw();
  });
}