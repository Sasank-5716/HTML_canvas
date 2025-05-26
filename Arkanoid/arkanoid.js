const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
  color: '#00bfff',
  radius: 10,
};

// Ball properties
const ball = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  radius: 12,
  color: '#ff6f61',
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
  colors: ['#ff4e50', '#fc913a', '#f9d423', '#eae374', '#e1f5c4'],
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
        color: brick.colors[r % brick.colors.length] 
      };
    }
  }
}