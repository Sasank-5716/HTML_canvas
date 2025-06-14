const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY_MAGNITUDE = 0.5;
const PLAYER_SIZE = 40;
const TILE_SIZE = 50;

// Gravity directions
const GRAVITY_DIRECTIONS = {
  DOWN: { x: 0, y: 1 },
  UP: { x: 0, y: -1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

let gravity = GRAVITY_DIRECTIONS.DOWN;

// Level layout: 0 = empty, 1 = solid block, 2 = goal
const level = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Player object
const player = {
  x: TILE_SIZE * 2,
  y: TILE_SIZE * 9,
  width: PLAYER_SIZE,
  height: PLAYER_SIZE,
  velocityX: 0,
  velocityY: 0,
  speed: 3,
  onGround: false,
};

// Keyboard input
const keys = {
  left: false,
  right: false,
  gravityLeft: false,
  gravityRight: false,
  gravityUp: false,
  gravityDown: false,
};

function drawLevel() {
  for (let row = 0; row < level.length; row++) {
    for (let col = 0; col < level[row].length; col++) {
      const tile = level[row][col];
      if (tile === 1) {
        ctx.fillStyle = "#444";
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = "#666";
        ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (tile === 2) {
        ctx.fillStyle = "#0f0";
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "#f39c12";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // Draw eyes to indicate gravity direction
  ctx.fillStyle = "#222";
  const eyeSize = 6;
  let eyeX1, eyeY1, eyeX2, eyeY2;
  switch (gravity) {
    case GRAVITY_DIRECTIONS.DOWN:
      eyeX1 = player.x + 10;
      eyeY1 = player.y + 10;
      eyeX2 = player.x + player.width - 16;
      eyeY2 = player.y + 10;
      break;
    case GRAVITY_DIRECTIONS.UP:
      eyeX1 = player.x + 10;
      eyeY1 = player.y + player.height - 16;
      eyeX2 = player.x + player.width - 16;
      eyeY2 = player.y + player.height - 16;
      break;
    case GRAVITY_DIRECTIONS.LEFT:
      eyeX1 = player.x + player.width - 16;
      eyeY1 = player.y + 10;
      eyeX2 = player.x + player.width - 16;
      eyeY2 = player.y + player.height - 16;
      break;
    case GRAVITY_DIRECTIONS.RIGHT:
      eyeX1 = player.x + 10;
      eyeY1 = player.y + 10;
      eyeX2 = player.x + 10;
      eyeY2 = player.y + player.height - 16;
      break;
  }
  ctx.beginPath();
  ctx.arc(eyeX1, eyeY1, eyeSize / 2, 0, Math.PI * 2);
  ctx.arc(eyeX2, eyeY2, eyeSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

function rectIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function getTileAt(x, y) {
  const col = Math.floor(x / TILE_SIZE);
  const row = Math.floor(y / TILE_SIZE);
  if (row < 0 || row >= level.length || col < 0 || col >= level[0].length) {
    return 1; // Treat out of bounds as solid
  }
  return level[row][col];
}

function checkCollision(x, y, w, h) {
  // Check all corners for collision with solid tiles
  const points = [
    { x: x, y: y },
    { x: x + w, y: y },
    { x: x, y: y + h },
    { x: x + w, y: y + h },
  ];
  for (const p of points) {
    if (getTileAt(p.x, p.y) === 1) {
      return true;
    }
  }
  return false;
}

function updatePlayer() {
  // Horizontal movement (perpendicular to gravity)
  // Determine axis perpendicular to gravity
  let perpAxis = { x: 0, y: 0 };
  if (
    gravity === GRAVITY_DIRECTIONS.DOWN ||
    gravity === GRAVITY_DIRECTIONS.UP
  ) {
    perpAxis = { x: 1, y: 0 };
  } else {
    perpAxis = { x: 0, y: 1 };
  }
  // Move left/right relative to gravity
  if (keys.left) {
    player.velocityX = -player.speed * perpAxis.x;
    player.velocityY = -player.speed * perpAxis.y;
  } else if (keys.right) {
    player.velocityX = player.speed * perpAxis.x;
    player.velocityY = player.speed * perpAxis.y;
  } else {
    // Slow down horizontal movement
    player.velocityX *= 0.8;
    player.velocityY *= 0.8;
  }
  // Apply gravity acceleration
  player.velocityX += gravity.x * GRAVITY_MAGNITUDE;
  player.velocityY += gravity.y * GRAVITY_MAGNITUDE;

  // Calculate tentative new position
  let newX = player.x + player.velocityX;
  let newY = player.y + player.velocityY;

  // Check horizontal collisions
  if (!checkCollision(newX, player.y, player.width, player.height)) {
    player.x = newX;
  } else {
    player.velocityX = 0;
  }

  // Check vertical collisions
  if (!checkCollision(player.x, newY, player.width, player.height)) {
    player.y = newY;
  } else {
    player.velocityY = 0;
  }
   // Check if player reached goal tile
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;
  if (getTileAt(playerCenterX, playerCenterY) === 2) {
    alert('Level Complete! Congratulations!');
    resetGame();
  }
}

function resetGame() {
  player.x = TILE_SIZE * 2;
  player.y = TILE_SIZE * 9;
  player.velocityX = 0;
  player.velocityY = 0;
  gravity = GRAVITY_DIRECTIONS.DOWN;
}

function handleGravityChange() {
  if (keys.gravityDown) gravity = GRAVITY_DIRECTIONS.DOWN;
  else if (keys.gravityUp) gravity = GRAVITY_DIRECTIONS.UP;
  else if (keys.gravityLeft) gravity = GRAVITY_DIRECTIONS.LEFT;
  else if (keys.gravityRight) gravity = GRAVITY_DIRECTIONS.RIGHT;
}

function drawGravityIndicator() {
  ctx.fillStyle = '#fff';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Gravity: ' + 
    (gravity === GRAVITY_DIRECTIONS.DOWN ? 'Down' :
    gravity === GRAVITY_DIRECTIONS.UP ? 'Up' :
    gravity === GRAVITY_DIRECTIONS.LEFT ? 'Left' : 'Right'), 10, 580);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLevel();
  handleGravityChange();
  updatePlayer();
  drawPlayer();
  drawGravityIndicator();
  requestAnimationFrame(gameLoop);
}

// Keyboard event listeners
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      keys.left = true;
      break;
    case 'ArrowRight':
    case 'd':
      keys.right = true;
      break;
    case 'ArrowDown':
      keys.gravityDown = true;
      keys.gravityUp = keys.gravityLeft = keys.gravityRight = false;
      break;
    case 'ArrowUp':
      keys.gravityUp = true;
      keys.gravityDown = keys.gravityLeft = keys.gravityRight = false;
      break;
    case 'q':
      keys.gravityLeft = true;
      keys.gravityDown = keys.gravityUp = keys.gravityRight = false;
      break;
    case 'e':
      keys.gravityRight = true;
      keys.gravityDown = keys.gravityUp = keys.gravityLeft = false;
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      keys.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      keys.right = false;
      break;
  }
});

// Initialize game
resetGame();
gameLoop();
