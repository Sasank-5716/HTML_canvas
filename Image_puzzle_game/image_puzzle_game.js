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

function initTiles() {
    tiles = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        tiles.push({
          sx: x * tileWidth,
          sy: y * tileHeight,
          x: x,
          y: y,
          correctX: x,
          correctY: y,
        });
      }
    }
    solved = false;
    setMessage('');
  }

  function shuffleTiles() {
    // Fisher-Yates shuffle on tile positions
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i].x, tiles[j].x] = [tiles[j].x, tiles[i].x];
      [tiles[i].y, tiles[j].y] = [tiles[j].y, tiles[i].y];
    }
  }

   function drawTiles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tiles.forEach(tile => {
      ctx.drawImage(
        img,
        tile.sx, tile.sy, tileWidth, tileHeight,
        tile.x * tileWidth, tile.y * tileHeight, tileWidth, tileHeight
      );
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(tile.x * tileWidth, tile.y * tileHeight, tileWidth, tileHeight);
    });

    if (firstSelected !== null) {
      // Highlight selected tile
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = 4;
      ctx.strokeRect(firstSelected.x * tileWidth, firstSelected.y * tileHeight, tileWidth, tileHeight);
    }
  }

function getTileAtPosition(x, y) {
    const tileX = Math.floor(x / tileWidth);
    const tileY = Math.floor(y / tileHeight);
    return tiles.find(t => t.x === tileX && t.y === tileY);
  }

 function swapTiles(tile1, tile2) {
    [tile1.x, tile2.x] = [tile2.x, tile1.x];
    [tile1.y, tile2.y] = [tile2.y, tile1.y];
  }

  function checkSolved() {
    return tiles.every(tile => tile.x === tile.correctX && tile.y === tile.correctY);
  }

  function setMessage(msg) {
    document.getElementById('message').textContent = msg;
  }
  })();