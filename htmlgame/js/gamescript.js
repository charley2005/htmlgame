let ctx, canvaswidth, canvasheight;
const fps = 60;
const Interval = 1000 / fps;
canvaswidth = 800;
canvasheight = 600;
let ship, kogels, enemies;
let keys = {};
let spacePressed = false;
let mousePressed = false;
let canFire = true;
let autofireTimer = null;
let maxBullets = 5;
let score = 0;
let lives = 3; // Number of lives
let gameStarted = false;


let gameState = "playing"; // "playing", "gameOver"




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

    if (gameState === "gameOver") {
      drawGameOverScreen();
      return; // Exit the gameloop when in game over state
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
  ship = new Sprite(300, 500, 0, 0, 50, 50, "images/ship.png");
  kogels = [];
  for (let i = 0; i < maxBullets; i++) {
    let kogel = new Sprite(300, 500, 0, -0.5, 10, 10, "images/bullet.png");
    kogel.alive = false;
    kogels.push(kogel);
  }
  document.getElementById("startScreen").style.display = "flex";
  enemies = [];
  createEnemies();
  start();
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);


  gameStarted = false;
  score = 0;
  lives = 3;
  gameState = "playing";
}
function startGame() {
  // Hide the start screen
  document.getElementById("startScreen").style.display = "none";

  if (!gameStarted) {
    gameStarted = true;
    setTimeout(() => {
      enemies = [];
      createEnemies();
    }, 0);

    // Start the game loop
    start();
  }
}

function handleKeyDown(event) {
  keys[event.key] = true;
  if ((event.key === " " || event.key === "Space") && canFire) {
    spacePressed = true;
    fireBullet();
    canFire = false;
  }
}

function handleKeyUp(event) {
  keys[event.key] = false;

  if (event.key === " ") {
    spacePressed = false;
    canFire = true;
  }
}

function handleMouseDown(event) {
  if (event.button === 0 && canFire) {
    mousePressed = true;
    autofireTimer = setInterval(fireBullet, 200);
    canFire = false;
  }
}

function handleMouseUp(event) {
  if (event.button === 0) {
    mousePressed = false;
    clearInterval(autofireTimer);
    autofireTimer = null;
    canFire = true;
  }
}

function fireBullet() {
  let bulletsOnScreen = kogels.filter((kogel) => kogel.alive).length;
  if (bulletsOnScreen < maxBullets) {
    for (let i = 0; i < kogels.length; i++) {
      if (!kogels[i].alive) {
        kogels[i].x = ship.x + ship.width / 2 - kogels[i].width / 2;
        kogels[i].y = ship.y;
        kogels[i].alive = true;
        break;
      }
    }
  }
}

function createEnemies() {
  if(!gameStarted){
    return;
  }
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvaswidth;
    const y = -50;
    const speed = Math.random() * 0.04 + 0.01;
    const basicEnemy = new Sprite(x, y, 0, speed, 50, 50, "images/basicEnemy.png");
    basicEnemy.scoreValue = 100; // Set score value for the enemy
    enemies.push(basicEnemy);
  }
}

function areColliding(sprite1, sprite2) {
  return (
    sprite1.x < sprite2.x + sprite2.width &&
    sprite1.x + sprite1.width > sprite2.x &&
    sprite1.y < sprite2.y + sprite2.height &&
    sprite1.y + sprite1.height > sprite2.y
  );
}

function update() {
  if (gameState === "playing") {
    const sprites = [ship, ...enemies];
    sprites.forEach((sprite) => {
      if (sprite.alive) {
        sprite.update();
        if (sprite.x < -sprite.width) {
          sprite.x = canvaswidth;
        } else if (sprite.x > canvaswidth) {
          sprite.x = -sprite.width;
        }

        if (sprite.y < 0) {
          sprite.y = 0;
        }

        if (sprite.y < -sprite.height) {
          sprite.y = canvasheight;
        } else if (sprite.y > canvasheight) {
          sprite.y = -sprite.height;
        }
      }
      if(enemies.length === 0 && lives > 0){
        createEnemies();
      }
    });

    kogels.forEach((kogel) => {
      if (kogel.alive) {
        kogel.update();
        if (kogel.y < -kogel.height) {
          kogel.alive = false;
        }

        enemies.forEach((basicEnemy) => {
          if (kogel.alive && areColliding(kogel, basicEnemy) && !basicEnemy.isColliding) {
            kogel.alive = false;
            basicEnemy.alive = false;
            score += basicEnemy.scoreValue; // Increase the score
            basicEnemy.isColliding = true;
          }
        });
      }
    });

    if (!ship.isColliding && ship.alive) {
      enemies.forEach((basicEnemy) => {
        if (areColliding(ship, basicEnemy)) {
          ship.isColliding = true;
          lives--;
  
          // Make the ship invulnerable and pulsate for 2 seconds
          ship.alive = false;
          setTimeout(() => {
            ship.x = 300;
            ship.y = 500;
            ship.alive = true;
  
            // Disable collision checks during pulsating effect
            ship.isColliding = true;
  
            // Pulsating effect for 2 seconds
            let pulsateDuration = 2000; // 2 seconds
            let pulsateInterval = 500; // 50 milliseconds
            let pulsateCount = pulsateDuration / pulsateInterval;
            let isPulsating = false;
  
            let pulsateTimer = setInterval(() => {
              if (isPulsating) {
                ship.width += 5;
                
                ship.height += 5;
              } else {
                ship.width -= 5;
                ship.height -= 5;
              }
  
              isPulsating = !isPulsating;
              pulsateCount--;
  
              if (pulsateCount <= 0) {
                // Stop the pulsating effect
                clearInterval(pulsateTimer);
                ship.width = 50; // Reset to original width
                ship.height = 50; // Reset to original height
  
                // Enable collision checks after pulsating effect
                ship.isColliding = false;
              }
            }, pulsateInterval);
          }, 0);
        }
      });
    }

    enemies = enemies.filter((basicEnemy) => basicEnemy.alive);

    if (lives <= 0) {
      gameState = "gameOver";
      drawGameOverScreen();
    }

    if (enemies.length === 0 && lives > 0) {
      createEnemies();
    }

    if (keys["a"] && ship.alive) {
      ship.x -= 0.15;
    }
    if (keys["d"] && ship.alive) {
      ship.x += 0.15;
    }

    if (keys["w"] && ship.y > 0 && ship.alive) {
      ship.y -= 0.15;
    }

    if (keys["s"] && ship.y < canvasheight - ship.height && ship.alive) {
      ship.y += 0.15;
    }

    if (spacePressed) {
      fireBullet();
    }

    if (mousePressed && !autofireTimer && ship.alive) {
      autofireTimer = setInterval(fireBullet, 100);
    } else if (!mousePressed && autofireTimer) {
      clearInterval(autofireTimer);
      autofireTimer = null;
    }
  } else if (gameState === "gameOver") {
    drawGameOverScreen();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvaswidth, canvasheight);

  kogels.forEach((kogel) => {
    if (kogel.alive) {
      kogel.draw();
    }
  });

  if (ship.alive) {
    ship.draw();
  }

  const aliveEnemies = enemies.filter((basicEnemy) => basicEnemy.alive);
  aliveEnemies.forEach((enemy) => {
    enemy.draw();
  });

  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("lives").innerText = "Lives: " + lives;
}

function drawGameOverScreen() {
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvaswidth, canvasheight);

  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over!", canvaswidth / 2 - 100, canvasheight / 2 - 30);
  ctx.fillText("Score: " + score, canvaswidth / 2 - 100, canvasheight / 2 + 10);

  // Show the game over screen div
  const gameOverScreenDiv = document.getElementById("gameOverScreen");
  gameOverScreenDiv.style.display = "block";
}



function restartGame() {
location.reload();
}



