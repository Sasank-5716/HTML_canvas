const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');



setInterval(drawClock, 1000);
drawClock();