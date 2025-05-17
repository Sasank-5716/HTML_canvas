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