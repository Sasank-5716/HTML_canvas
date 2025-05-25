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