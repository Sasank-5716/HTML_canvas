const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElem = document.getElementById('score');
const powerFill = document.getElementById('powerFill');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let score = 0;

// Basketball properties
const ballRadius = 15;
const ballStartX = 100;
const ballStartY = HEIGHT - 50;

const gravity = 0.5; // gravity acceleration

// Hoop properties
const hoopX = WIDTH - 120;
const hoopY = HEIGHT - 180;
const hoopWidth = 60;
const hoopHeight = 10;
const rimRadius = 25;

// Power meter
const maxPower = 20;
let power = 0;
let charging = false;
let powerDirection = 1; // 1 for increasing, -1 for decreasing

// Ball state
let ball = {
  x: ballStartX,
  y: ballStartY,
  vx: 0,
  vy: 0,
  moving: false,
  scored: false,
};

// Animations and effects
let particles = [];

function drawBackground() {
  // Gradient court floor
  let grd = ctx.createLinearGradient(0, HEIGHT, 0, HEIGHT - 100);
  grd.addColorStop(0, '#d2691e');
  grd.addColorStop(1, '#8b4513');
  ctx.fillStyle = grd;
  ctx.fillRect(0, HEIGHT - 100, WIDTH, 100);

  // Court lines
  ctx.strokeStyle = '#fff8dc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hoopX - rimRadius, HEIGHT - 100);
  ctx.lineTo(hoopX - rimRadius, hoopY + 5);
  ctx.stroke();

  // Backboard
  ctx.fillStyle = '#fff';
  ctx.fillRect(hoopX + hoopWidth / 2 - 5, hoopY - 40, 10, 60);

  // Hoop rim
  ctx.strokeStyle = '#ff4500';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(hoopX, hoopY, rimRadius, 0, Math.PI, true);
  ctx.stroke();
}

function drawBall() {
  // Ball shadow
  ctx.beginPath();
  ctx.ellipse(ball.x + 5, ball.y + 10, ballRadius * 0.9, ballRadius * 0.5, 0, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  // Ball body
  let gradient = ctx.createRadialGradient(ball.x - 5, ball.y - 5, ballRadius / 4, ball.x, ball.y, ballRadius);
  gradient.addColorStop(0, '#ff8c00');
  gradient.addColorStop(1, '#b35900');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI);
  ctx.fill();

   // Ball lines
  ctx.strokeStyle = '#663300';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI);
  ctx.moveTo(ball.x - ballRadius, ball.y);
  ctx.lineTo(ball.x + ballRadius, ball.y);
  ctx.moveTo(ball.x - ballRadius * 0.7, ball.y - ballRadius * 0.7);
  ctx.lineTo(ball.x + ballRadius * 0.7, ball.y + ballRadius * 0.7);
  ctx.moveTo(ball.x - ballRadius * 0.7, ball.y + ballRadius * 0.7);
  ctx.lineTo(ball.x + ballRadius * 0.7, ball.y - ballRadius * 0.7);
  ctx.stroke();
}

function drawPowerMeter() {
  powerFill.style.width = `${(power / maxPower) * 100}%`;
}

function resetBall() {
  ball.x = ballStartX;
  ball.y = ballStartY;
  ball.vx = 0;
  ball.vy = 0;
  ball.moving = false;
  ball.scored = false;
  power = 0;
  powerDirection = 1;
  drawPowerMeter();
}

function shootBall() {
  const angle = Math.PI / 4; // 45 degrees for nice arc
  const velocity = power;

  ball.vx = velocity * Math.cos(angle);
  ball.vy = -velocity * Math.sin(angle);
  ball.moving = true;
}

function updateBall() {
  if (!ball.moving) return;

  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vy += gravity; // gravity effect

  // Floor collision
  if (ball.y + ballRadius > HEIGHT - 100) {
    ball.y = HEIGHT - 100 - ballRadius;
    ball.vy *= -0.5; // bounce with damping
    ball.vx *= 0.7; // friction slows horizontal speed

    if (Math.abs(ball.vy) < 1) {
      ball.vy = 0;
    }
    if (Math.abs(ball.vx) < 0.5) {
      ball.vx = 0;
    }
    if (ball.vx === 0 && ball.vy === 0) {
      ball.moving = false;
      if (!ball.scored) {
        score = 0; // reset score on miss
        updateScore();
      }
      setTimeout(resetBall, 1000);
    }
  }
  // Hoop scoring detection - ball passes through rim from top
  if (
    ball.x > hoopX - rimRadius &&
    ball.x < hoopX + rimRadius &&
    ball.y > hoopY - ballRadius &&
    ball.y < hoopY + rimRadius &&
    ball.vy > 0 &&
    !ball.scored
  ) {
    ball.scored = true;
    score++;
    updateScore();
    createScoreParticles(hoopX, hoopY);
    setTimeout(resetBall, 1500);
  }
}

function updateScore() {
  scoreElem.textContent = score;
}

function createScoreParticles(x, y) {
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 1.5) * 6,
      alpha: 1,
      radius: 3 + Math.random() * 2,
      color: `hsl(${30 + Math.random() * 40}, 100%, 60%)`,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15; // gravity for particles
    p.alpha -= 0.03;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 140, 0, ${p.alpha})`;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

function drawPowerArrow() {
  if (!charging) return;
  const arrowLength = power * 10;
  const startX = ball.x;
  const startY = ball.y;
  const angle = Math.PI / 4;

  ctx.save();
  ctx.strokeStyle = '#ffb300';
  ctx.fillStyle = '#ffb300';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#ffb300';
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX + arrowLength * Math.cos(angle), startY - arrowLength * Math.sin(angle));
  ctx.stroke();

  // Arrowhead
  const arrowX = startX + arrowLength * Math.cos(angle);
  const arrowY = startY - arrowLength * Math.sin(angle);
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX - 10 * Math.cos(angle - Math.PI / 6), arrowY + 10 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(arrowX - 10 * Math.cos(angle + Math.PI / 6), arrowY + 10 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawBackground();
  drawBall();
  drawPowerArrow();
  drawParticles();

  updateBall();
  updateParticles();

  requestAnimationFrame(gameLoop);
}

function chargePower() {
  if (!charging) return;
  power += powerDirection * 0.3;
  if (power >= maxPower) {
    powerDirection = -1;
    power = maxPower;
  } else if (power <= 0) {
    powerDirection = 1;
    power = 0;
  }
  drawPowerMeter();
}

// Event handlers
canvas.addEventListener('mousedown', () => {
  if (ball.moving) return;
  charging = true;
});

canvas.addEventListener('mouseup', () => {
  if (!charging) return;
  charging = false;
  if (power > 0) {
    shootBall();
  }
  power = 0;
  powerDirection = 1;
  drawPowerMeter();
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!charging && !ball.moving) {
      charging = true;
    }
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (charging) {
      charging = false;
      if (power > 0) {
        shootBall();
      }
      power = 0;
      powerDirection = 1;
      drawPowerMeter();
    }
  }
});

// Start the game
resetBall();
updateScore();
gameLoop();
setInterval(chargePower, 16);