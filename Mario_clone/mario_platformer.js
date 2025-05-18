const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameOverDiv = document.getElementById('gameOver');

// Add level indicator div dynamically
const levelIndicator = document.createElement('div');
levelIndicator.id = 'levelIndicator';
document.body.appendChild(levelIndicator);

const GRAVITY = 0.6;
const FRICTION = 0.8;
const PLAYER_SPEED = 7;  // slightly faster for bigger canvas
const JUMP_POWER = 18;   // stronger jump for bigger canvas

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
        this.y + this.height > platform.y &&
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
    ctx.fillStyle = 'red';
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
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
  }
}