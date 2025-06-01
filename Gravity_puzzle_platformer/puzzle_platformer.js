const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,1,1,1,1,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,1,1,1,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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