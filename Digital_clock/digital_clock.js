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
     
    // Draw country label
    ctx.font = "18px monospace";
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(countryLabel, canvas.width / 2, 30);
     
    // Draw time (middle)
    ctx.font = "bold 60px monospace"; // Smaller font for more space
    ctx.fillStyle = "#00FF99";
    ctx.textBaseline = "middle";
    ctx.fillText(timeOnly, canvas.width / 2, canvas.height / 2);

    // Draw time zone abbreviation (below time)
    ctx.font = "bold 24px monospace";
    ctx.fillStyle = "#FFD700";
    ctx.textBaseline = "top";
    ctx.fillText(tzAbbr ? tzAbbr[1] : "", canvas.width / 2, canvas.height / 2 + 35);
  
    // Draw date
    ctx.font = "20px monospace";
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "bottom";
    ctx.fillText(dateString, canvas.width / 2, canvas.height - 20);
  
   
  }

setInterval(drawClock, 1000);
drawClock();