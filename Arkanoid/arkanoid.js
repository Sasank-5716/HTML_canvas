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