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