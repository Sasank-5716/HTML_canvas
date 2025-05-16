(() => {
  const canvas = document.getElementById("puzzleCanvas");
  const ctx = canvas.getContext("2d");

  let solved = false;
  let tileSize;

  const tileCount = 3;
  const size = canvas.width; // assuming square canvas
  tileSize = size / tileCount;
  let img = new Image();
  img.src = "./sasank02.jpg";

  let tiles = [];
  let emptyPos = { x: tileCount - 1, y: tileCount - 1 }; // bottom-right empty tile

  // Cropped and scaled image source for tiles
  let source;

  img.onload = () => {
    const fixedSize = 450;
  canvas.width = fixedSize;
  canvas.height = fixedSize;
  tileSize = fixedSize / tileCount;
 emptyPos = { x: tileCount - 1, y: tileCount - 1 };
    solved = false;
    // Initialize tiles with updated tile sizes
    initTiles();

    shuffleTiles();
    drawTiles();
    setMessage("");
  };

  function initTiles() {
    tiles = [];
    for (let y = 0; y < tileCount; y++) {
      for (let x = 0; x < tileCount; x++) {
        // Skip the tile at the empty position (bottom-right corner initially)
        if (x === emptyPos.x && y === emptyPos.y) continue;

        tiles.push({
          x,
          y, // Current tile position on grid
          correctX: x, // Correct position for win check
          correctY: y,
          draw: function(){
            ctx.drawImage(
              img,
              this.correctX * tileSize,
              this.correctY * tileSize,
              tileSize,
              tileSize,
              this.x * tileSize,
              this.y * tileSize,
              tileSize,
              tileSize
            )
          }
        });
      }
    }
  }

  // Check if tile is adjacent to empty space
  function isAdjacent(tile, empty) {
    return (
      (Math.abs(tile.x - empty.x) === 1 && tile.y === empty.y) ||
      (Math.abs(tile.y - empty.y) === 1 && tile.x === empty.x)
    );
  }

  // Move tile into empty space
  function moveTile(tile) {
    [tile.x, emptyPos.x] = [emptyPos.x, tile.x];
    [tile.y, emptyPos.y] = [emptyPos.y, tile.y];
  }

  // Shuffle by simulating valid moves to ensure solvability
  function shuffleTiles() {
    for (let i = 0; i < 1000; i++) {
      const movable = tiles.filter((t) => isAdjacent(t, emptyPos));
      const randomTile = movable[Math.floor(Math.random() * movable.length)];
      moveTile(randomTile);
    }
    solved = false;
    emptyPos = { x: tileCount - 1, y: tileCount - 1 };

  }

  // Draw puzzle tiles and empty space
  function drawTiles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw empty tile as gray rectangle
    ctx.fillStyle = "#ddd";
    ctx.fillRect(
      emptyPos.x * tileSize,
      emptyPos.y * tileSize,
      tileSize,
      tileSize
    );

    // Draw all tiles
    tiles.forEach((tile) => tile.draw());

    // Draw grid lines
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    for (let i = 0; i <= tileCount; i++) {
  ctx.beginPath();
  ctx.moveTo(i * tileSize, 0);
  ctx.lineTo(i * tileSize, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, i * tileSize);
  ctx.lineTo(canvas.width, i * tileSize);
  ctx.stroke();
}

  }

  // Check if puzzle is solved
  function checkSolved() {
    return tiles.every((t) => t.x === t.correctX && t.y === t.correctY);
  }

  // Show message on solve
  function setMessage(msg) {
    document.getElementById("message").textContent = msg;
  }

  canvas.addEventListener("click", (e) => {
    if (solved) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const x = Math.floor(clickX / tileSize);
    const y = Math.floor(clickY / tileSize);

    const clickedTile = tiles.find((t) => t.x === x && t.y === y);
    if (clickedTile && isAdjacent(clickedTile, emptyPos)) {
      moveTile(clickedTile);
      drawTiles();

      if (checkSolved()) {
        solved = true;
        setMessage("🎉 Congratulations! Puzzle Solved!");
      }
    }
  });

  // Shuffle button handler
  document.getElementById("shuffleBtn").addEventListener("click", () => {
    emptyPos = { x: tileCount - 1, y: tileCount - 1 };
    initTiles();
    shuffleTiles();
    drawTiles();
    setMessage("");
  });
})();
