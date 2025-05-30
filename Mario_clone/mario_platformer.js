const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameOverDiv = document.getElementById("gameOver");

// Add level indicator div dynamically
const levelIndicator = document.createElement("div");
levelIndicator.id = "levelIndicator";
document.body.appendChild(levelIndicator);

const GRAVITY = 0.6;
const FRICTION = 0.8;
const PLAYER_SPEED = 7; // slightly faster for bigger canvas
const JUMP_POWER = 18; // stronger jump for bigger canvas

let keys = {
  left: false,
  right: false,
  up: false,
};

class Player {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = 100;
    this.y = 0;
    this.velX = 0;
    this.velY = 0;
    this.jumping = false;
  }

  update() {
    if (keys.left) {
      this.velX = -PLAYER_SPEED;
    } else if (keys.right) {
      this.velX = PLAYER_SPEED;
    } else {
      this.velX *= FRICTION;
      if (Math.abs(this.velX) < 0.1) this.velX = 0;
    }

    this.velY += GRAVITY;

    this.x += this.velX;
    this.y += this.velY;

    this.jumping = true;
    for (let platform of currentPlatforms) {
      if (
        this.x < platform.x + platform.width &&
        this.x + this.width > platform.x &&
        this.y + this.height > platform.y -5 &&
        this.y + this.height < platform.y + platform.height &&
        this.velY >= 0
      ) {
        this.y = platform.y - this.height;
        this.velY = 0;
        this.jumping = false;
      }
    }
    if (this.x < 0) {
      this.x = 0;
      this.velX = 0;
    }
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(offsetX) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
  }
}

class Flag {
  constructor(x, y, isStart = false) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 50;
    this.isStart = isStart;
  }

  draw(offsetX) {
    const baseX = this.x - offsetX;
    ctx.fillStyle = "#8B4513"; // pole
    ctx.fillRect(
      baseX + this.width / 2 - 2,
      this.y - this.height,
      4,
      this.height
    );

    ctx.fillStyle = this.isStart ? "blue" : "red";
    ctx.beginPath();
    ctx.moveTo(baseX + this.width / 2 + 2, this.y - this.height);
    ctx.lineTo(baseX + this.width / 2 + 22, this.y - this.height + 15);
    ctx.lineTo(baseX + this.width / 2 + 2, this.y - this.height + 30);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "green";
    ctx.fillRect(baseX, this.y, this.width, 10);
  }
}

// Generate 10 levels with increasing difficulty and length
const levels = [];

function generateLevel(levelNum) {
  const baseY = 550; // ground level for platforms (canvas height 600 - 50)
  const levelLength = 2200 + levelNum * 500; // longer with each level
  const platformCount = 6 + levelNum; // more platforms with level
  const platforms = [];

  // Long start platform
  platforms.push(new Platform(0, baseY-10, 400, 20));

  // Intermediate platforms
  let currentX = 450;
  for (let i = 0; i < platformCount; i++) {
    // Platform width decreases as level increases (harder)
    const width = 150 - Math.min(levelNum * 10, 100);
    // Y varies with some randomness and difficulty
    const y = baseY - 50 - Math.random() * 100 - levelNum * 5;

    platforms.push(new Platform(currentX, y, width, 20));
    // Gap increases with level number (harder)
    currentX += width + 150 + levelNum * 20;
  }

  // Long end platform - FIXED to baseY to avoid game over bug
  platforms.push(new Platform(currentX, baseY-10, 400, 20));

  const startFlag = new Flag(50, baseY, true);
  const endFlag = new Flag(currentX + 350, baseY- 10, false);

  return { platforms, startFlag, endFlag };
}

// Create 10 levels
for (let i = 0; i < 10; i++) {
  levels.push(generateLevel(i));
}

let currentLevel = 0;
let currentPlatforms = levels[currentLevel].platforms;
let currentStartFlag = levels[currentLevel].startFlag;
let currentEndFlag = levels[currentLevel].endFlag;

const player = new Player();
let cameraX = 0;
let gameOver = false;
let gameOverTimeout = null;

function resetLevel(levelIndex) {
  currentLevel = levelIndex;
  currentPlatforms = levels[currentLevel].platforms;
  currentStartFlag = levels[currentLevel].startFlag;
  currentEndFlag = levels[currentLevel].endFlag;

  player.x = currentStartFlag.x + 30;
  player.y = currentStartFlag.y - player.height;
  player.velX = 0;
  player.velY = 0;
  player.jumping = false;
  cameraX = 0;
  gameOver = false;
  gameOverDiv.classList.add('hidden');
  updateLevelIndicator();
}

function updateLevelIndicator() {
  levelIndicator.textContent = `Level ${currentLevel + 1}`;
}

function showGameOver() {
  gameOver = true;
  gameOverDiv.classList.remove('hidden');
  gameOverTimeout = setTimeout(() => {
    resetLevel(0);
  }, 2000);
}

function gameLoop() {
  if (gameOver) {
    requestAnimationFrame(gameLoop);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.update();

  // Game over if player touches brown ground (bottom 30px)
  // Added 5px buffer to reduce false positives
  if (player.y + player.height > canvas.height - 30 + 5) {
    showGameOver();
  }
// Camera follows player, clamp to level width
  const levelWidth = Math.max(...currentPlatforms.map(p => p.x + p.width)) + 400;
  cameraX = player.x - canvas.width / 4;
  if (cameraX < 0) cameraX = 0;
  if (cameraX > levelWidth - canvas.width) cameraX = levelWidth - canvas.width;

  drawBackground();
  for (let platform of currentPlatforms) {
    platform.draw(cameraX);
  }

  currentStartFlag.draw(cameraX);
  currentEndFlag.draw(cameraX);

  ctx.save();
  ctx.translate(-cameraX, 0);
  player.draw();
  ctx.restore();

  // Check if player reached end flag
  if (
    player.x + player.width > currentEndFlag.x &&
    player.x < currentEndFlag.x + currentEndFlag.width &&
    player.y + player.height > currentEndFlag.y - currentEndFlag.height
  ) {
    currentLevel++;
    if (currentLevel >= levels.length) {
      alert('🎉 Congratulations! You completed all 10 levels! 🎉');
      resetLevel(0);
    } else {
      resetLevel(currentLevel);
    }
  }

  requestAnimationFrame(gameLoop);
}

function drawBackground() {
  ctx.fillStyle = '#654321'; // brown ground
  ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
}

window.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
  if ((e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') && !player.jumping) {
    player.velY = -JUMP_POWER;
    player.jumping = true;
  }
});

window.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
});

resetLevel(0);
gameLoop();