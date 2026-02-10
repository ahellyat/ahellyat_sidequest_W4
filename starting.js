let grid;
let gameWon = false;

function setup() {
  createCanvas(500, 500);
  grid = generateArray(10, 10);
  console.log("Grid created:", grid);

  // Initialize arrow key controls
  // Pass a callback so we can check for a win after movement
  initializeArrowKeyControls(grid, () => {
    checkWin();
  });
}

function draw() {
  background(220);
  drawLevel(grid);
  drawPlayerCircle();
  if (gameWon) {
    showWinScreen();
  }
}

// Check if the player's current position is on a cell with value 3
function checkWin() {
  const pos = getPlayerPosition();
  if (!pos || !grid) return;
  const row = pos[0];
  const col = pos[1];
  if (grid[row] && grid[row][col] === 3) {
    gameWon = true;
  }
}

// Render a simple "you win!" screen overlay
function showWinScreen() {
  push();
  // semi-transparent dark overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // Win text
  textAlign(CENTER, CENTER);
  fill(255);
  noStroke();
  textSize(48);
  text("you win!", width / 2, height / 2);
  pop();
}
