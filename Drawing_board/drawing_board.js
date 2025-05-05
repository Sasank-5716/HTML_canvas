const canvas = document.getElementById('drawingBoard');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

ctx.strokeStyle = '#000000';
ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
