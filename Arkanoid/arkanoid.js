const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const paddle = {
  width: 120,
  height: 20,
  x: WIDTH / 2 - 60,
  y: HEIGHT - 40,
  speed: 8,
  dx: 0,
  color: "#00bfff",
  radius: 10,
};

// Ball properties
const ball = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  radius: 12,
  color: "#ff6f61",
  speedX: 4,
  speedY: -6,
  gravity: 0.25,
  gravitySpeed: 0,
  maxSpeedY: 12,
};

// Brick properties
const brick = {
  rowCount: 5,
  columnCount: 9,
  width: 70,
  height: 25,
  padding: 12,
  offsetTop: 60,
  offsetLeft: 45,
  colors: ["#ff4e50", "#fc913a", "#f9d423", "#eae374", "#e1f5c4"],
};

let bricks = [];
let score = 0;
let lives = 3;
let isGameOver = false;
let isGameWon = false;

// Initialize bricks
function initBricks() {
  bricks = [];
  for (let r = 0; r < brick.rowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.columnCount; c++) {
      bricks[r][c] = {
        x: 0,
        y: 0,
        status: 1,
        color: brick.colors[r % brick.colors.length],
      };
    }
  }
}

function drawPaddle() {
  ctx.fillStyle = paddle.color;
  ctx.beginPath();
  // Rounded rectangle paddle
  const x = paddle.x;
  const y = paddle.y;
  const w = paddle.width;
  const h = paddle.height;
  const r = paddle.radius;

  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

// Draw ball with shadow/glow
function drawBall() {
  ctx.beginPath();
  ctx.shadowColor = "rgba(255, 111, 97, 0.7)";
  ctx.shadowBlur = 15;
  ctx.fillStyle = ball.color;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c < brick.columnCount; c++) {
      if (bricks[r][c].status === 1) {
        const brickX = brick.offsetLeft + c * (brick.width + brick.padding);
        const brickY = brick.offsetTop + r * (brick.height + brick.padding);
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;

        // Brick with gradient fill
        const grad = ctx.createLinearGradient(brickX, brickY, brickX + brick.width, brickY + brick.height);
        grad.addColorStop(0, bricks[r][c].color);
        grad.addColorStop(1, '#222');

        ctx.fillStyle = grad;
        ctx.shadowColor = bricks[r][c].color;
        ctx.shadowBlur = 10;
        ctx.fillRect(brickX, brickY, brick.width, brick.height);
        ctx.shadowBlur = 0;

        // Brick border
        ctx.strokeStyle = '#0008';
        ctx.lineWidth = 2;
        ctx.strokeRect(brickX, brickY, brick.width, brick.height);
      }
    }
  }
}

// Draw score and lives
function drawScore() {
  ctx.font = '20px Segoe UI';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function drawLives() {
  ctx.font = '20px Segoe UI';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Lives: ${lives}`, WIDTH - 110, 30);
}

// Draw game over or win message
function drawMessage(text) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, HEIGHT / 2 - 60, WIDTH, 120);

  ctx.font = '48px Segoe UI';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText(text, WIDTH / 2, HEIGHT / 2 + 15);
  ctx.textAlign = 'start';
}

// Update paddle position based on dx
function movePaddle() {
  paddle.x += paddle.dx;

  // Update paddle position based on dx
function movePaddle() {
  paddle.x += paddle.dx;

  // Prevent going out of bounds
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > WIDTH) paddle.x = WIDTH - paddle.width;
}
}

// Update ball position and apply gravity
function moveBall() {
  // Apply gravity to vertical speed
  ball.gravitySpeed += ball.gravity;
  ball.speedY += ball.gravitySpeed;

   // Limit max downward speed to avoid excessive acceleration
  if (ball.speedY > ball.maxSpeedY) {
    ball.speedY = ball.maxSpeedY;
  }
   ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Bounce off left and right walls
  if (ball.x + ball.radius > WIDTH) {
    ball.x = WIDTH - ball.radius;
    ball.speedX = -ball.speedX;
  } else if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.speedX = -ball.speedX;
  }

  // Bounce off top wall
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.speedY = -ball.speedY;
    ball.gravitySpeed = 0; // Reset gravity effect on bounce
  }

  // Ball falls below paddle (lose life)
  if (ball.y - ball.radius > HEIGHT) {
    lives--;
    resetBallAndPaddle();
    if (lives <= 0) {
      isGameOver = true;
    }
  }
}

// Reset ball and paddle positions after life lost
function resetBallAndPaddle() {
  ball.x = WIDTH / 2;
  ball.y = HEIGHT / 2;
  ball.speedX = 4 * (Math.random() < 0.5 ? 1 : -1);
  ball.speedY = -6;
  ball.gravitySpeed = 0;

  paddle.x = WIDTH / 2 - paddle.width / 2;
  paddle.dx = 0;
}

// Detect collision between ball and paddle
function paddleCollision() {
  if (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  ) {
    // Reflect ball upward with some horizontal velocity change based on hit position
    ball.y = paddle.y - ball.radius;
    ball.speedY = -Math.abs(ball.speedY) * 0.9; 
    ball.gravitySpeed = 0; 

     const hitPos = (ball.x - paddle.x) / paddle.width;
    ball.speedX = (hitPos - 0.5) * 10;
  }
}

// Detect collision between ball and bricks
function brickCollision() {
  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c < brick.columnCount; c++) {
      const b = bricks[r][c];
      if (b.status === 1) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          ball.speedY = -ball.speedY;
          ball.gravitySpeed = 0; // Reset gravity effect on bounce
          b.status = 0;
          score += 10;

          // Check win condition
          if (score === brick.rowCount * brick.columnCount * 10) {
            isGameWon = true;// Check win condition
          if (score === brick.rowCount * brick.columnCount * 10) {
            isGameWon = true;
          }}
        }
      }
    }
  }
}

// Handle keyboard input
function keyDownHandler(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    paddle.dx = -paddle.speed;
  }
}

function keyUpHandler(e) {
  if (
    e.key === 'ArrowRight' ||
    e.key === 'Right' ||
    e.key === 'ArrowLeft' ||
    e.key === 'Left'
  ) {
    paddle.dx = 0;
  }
}

// Main game loop
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  drawLives();

  if (isGameOver) {
    drawMessage('Game Over! Refresh to play again.');
    return;
  }

  if (isGameWon) {
    drawMessage('You Win! Congratulations!');
    return;
  }
   movePaddle();
  moveBall();
  paddleCollision();
  brickCollision();

  requestAnimationFrame(draw);
}


