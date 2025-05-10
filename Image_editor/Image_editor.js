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

function cropImage() {
  if (!imgData) return;
  const cropWidth = 100, cropHeight = 100;
  const cropped = ctx.getImageData(0, 0, cropWidth, cropHeight);
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  ctx.putImageData(cropped, 0, 0);
  imgData = ctx.getImageData(0, 0, cropWidth, cropHeight); // update stored data
}

function rotateImage() {
  if (!img.src) return;
  angle = (angle + 90) % 360;
  
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  // Dynamic canvas sizing
  tempCanvas.width = angle % 180 === 0 ? img.width : img.height;
  tempCanvas.height = angle % 180 === 0 ? img.height : img.width;
  
  tempCtx.translate(tempCanvas.width/2, tempCanvas.height/2);
  tempCtx.rotate(angle * Math.PI/180);
  tempCtx.drawImage(img, -img.width/2, -img.height/2);
  
  // Update main canvas
  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.drawImage(tempCanvas, 0, 0);
  
  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  originalImgData = imgData; // Preserve rotated state
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