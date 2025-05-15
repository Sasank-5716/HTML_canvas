(() => {
  const canvas = document.getElementById('puzzleCanvas');
  const ctx = canvas.getContext('2d');

  const rows = 3;
  const cols = 3;
  const tileWidth = canvas.width / cols;
  const tileHeight = canvas.height / rows;
  let img = new Image();
  img.src = ''; 

  let tiles = [];
  let firstSelected = null;
  let solved = false;

  img.onload = () => {
    initTiles();
    shuffleTiles();
    drawTiles();
  };




  })();