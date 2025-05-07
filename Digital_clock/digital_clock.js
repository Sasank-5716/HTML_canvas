const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');

function drawClock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;
  
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.font = "bold 80px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#00FF99";
    ctx.fillText(timeString, canvas.width / 2, canvas.height / 2);
  }

setInterval(drawClock, 1000);
drawClock();