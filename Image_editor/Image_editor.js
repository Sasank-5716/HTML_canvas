const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();
let angle = 0;
let imgData = null;

// Handle image upload
document.getElementById('upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
      img.onload = function() {
        angle = 0;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        originalImgData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Save original
        currentImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);  // Current working copy
        isGrayscale = false;
        imgLoaded = true;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Grayscale filter
  let originalImgData = null; // Stores original pixel data
  let isGrayscale = false;
  
  function applyGrayscale() {
  if (!imgLoaded) return;

  if (!isGrayscale) {
    // Apply grayscale on current image data copy
    let data = new Uint8ClampedArray(currentImgData.data);
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    const grayImgData = new ImageData(data, canvas.width, canvas.height);
    ctx.putImageData(grayImgData, 0, 0);
    currentImgData = grayImgData;
    isGrayscale = true;
  } else {
    // Restore original image data
    ctx.putImageData(originalImgData, 0, 0);
    currentImgData = originalImgData;
    isGrayscale = false;
    }
  }
  
  // Invert filter
function applyInvert() {
  if (!imgData) return;
  let data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];       // R
    data[i + 1] = 255 - data[i+1]; // G
    data[i + 2] = 255 - data[i+2]; // B
  }
  ctx.putImageData(imgData, 0, 0);
}

let isCropping = false;
let cropStartX = 0, cropStartY = 0, cropEndX = 0, cropEndY = 0;

canvas.addEventListener('mousedown', (e) => {
  if (!imgLoaded) return;
  isCropping = true;
  const rect = canvas.getBoundingClientRect();
  cropStartX = e.clientX - rect.left;
  cropStartY = e.clientY - rect.top;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isCropping) return;
  const rect = canvas.getBoundingClientRect();
  cropEndX = e.clientX - rect.left;
  cropEndY = e.clientY - rect.top;

  // Redraw image and draw crop rectangle
  ctx.putImageData(currentImgData, 0, 0);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.setLineDash([6]);
  ctx.strokeRect(
    Math.min(cropStartX, cropEndX),
    Math.min(cropStartY, cropEndY),
    Math.abs(cropEndX - cropStartX),
    Math.abs(cropEndY - cropStartY)
  );
  ctx.setLineDash([]);
});

canvas.addEventListener('mouseup', () => {
  if (!isCropping) return;
  isCropping = false;

  let x = Math.min(cropStartX, cropEndX);
  let y = Math.min(cropStartY, cropEndY);
  let width = Math.abs(cropEndX - cropStartX);
  let height = Math.abs(cropEndY - cropStartY);

  if (width < 5 || height < 5) {
    ctx.putImageData(currentImgData, 0, 0); // Clear rectangle if too small
    return;
  }

  const croppedData = ctx.getImageData(x, y, width, height);
  canvas.width = width;
  canvas.height = height;
  ctx.putImageData(croppedData, 0, 0);

  originalImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  currentImgData = originalImgData;
  isGrayscale = false;
});


function rotateImage() {
  if (!imgLoaded) return;

  angle = (angle + 90) % 360;

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  // Swap width and height for 90 or 270 degrees rotation
  if (angle % 180 === 0) {
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
  } else {
    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;
  }

  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate(angle * Math.PI / 180);
  tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);

  originalImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  currentImgData = originalImgData;
  isGrayscale = false;
}



// Keyboard rotation
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    angle = (angle - 90 + 360) % 360;
    rotateImage();
  } else if (e.key === 'ArrowRight') {
    angle = (angle + 90) % 360;
    rotateImage();
  }
});