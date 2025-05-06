const canvas = document.getElementById('drawingBoard');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const eraserBtn = document.getElementById('eraserBtn');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');

let isDrawing = false;
let isEraser = false;
let lastX = 0;
let lastY = 0;

ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSize.value;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// UPDATED: Color picker event
colorPicker.addEventListener('change', () => {
  if (!isEraser) ctx.strokeStyle = colorPicker.value;
});

// UPDATED: Eraser button event
eraserBtn.addEventListener('click', () => {
  isEraser = !isEraser;
  eraserBtn.classList.toggle('active');
  ctx.strokeStyle = isEraser ? '#FFFFFF' : colorPicker.value;
});

// UPDATED: Brush size event
brushSize.addEventListener('input', () => {
  ctx.lineWidth = brushSize.value;
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', stopDrawing);

clearBtn.addEventListener('click', clearCanvas);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }
  
  function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }
  
  function stopDrawing() {
    isDrawing = false;
  }

  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    isDrawing = true;
  }
  
  function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }