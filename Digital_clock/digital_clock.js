const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');

const countryLabel = "Nepal (Kathmandu)";
const timeZone = "Asia/Kathmandu"; 

function drawClock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const now = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timeZone,
      timeZoneName: 'short'
    };
    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: timeZone
    };

    const timeString = now.toLocaleTimeString('en-US', options);
    const dateString = now.toLocaleDateString('en-US', dateOptions);
  
    // Extract time zone abbreviation (e.g., "ET", "CST")
    const tzAbbr = timeString.match(/\b([A-Z]{1,4})\b$/);
    const timeOnly = timeString.replace(/\s*[A-Z]{1,4}$/, '');
  
    // Draw background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 80px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#00FF99";
    ctx.fillText(timeOnly, canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "bold 28px monospace";
    ctx.fillStyle = "#FFD700";
    ctx.fillText(tzAbbr ? tzAbbr[1] : "", canvas.width / 2, canvas.height / 2 + 40);
  
    // Draw date
    ctx.font = "20px monospace";
    ctx.fillStyle = "#fff";
    ctx.fillText(dateString, canvas.width / 2, canvas.height - 40);
  
    // Draw country label
    ctx.font = "18px monospace";
    ctx.fillStyle = "#aaa";
    ctx.fillText(countryLabel, canvas.width / 2, 30);
  }

setInterval(drawClock, 1000);
drawClock();