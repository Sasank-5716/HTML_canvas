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
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Grayscale filter
function applyGrayscale() {
    if (!imgData) return;
    let data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    ctx.putImageData(imgData, 0, 0);
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