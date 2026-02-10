// Player position tracker
let playerPosition = [1, 1]; // Always starts at position 2

// Create a grid with player position marked as 4
function createPlayerGrid(grid) {
  // Create a deep copy of the grid
  let playerGrid = grid.map((row) => [...row]);

  // Mark the player's current position as 4
  playerGrid[playerPosition[0]][playerPosition[1]] = 4;

  return playerGrid;
}

// Update player position and return updated grid
function movePlayer(grid, newRow, newCol) {
  // Check if the new position is valid (not a wall/border)
  if (grid[newRow][newCol] === 0 || grid[newRow][newCol] === 3) {
    playerPosition = [newRow, newCol];
    return createPlayerGrid(grid);
  }

  // If invalid move, return current grid unchanged
  return createPlayerGrid(grid);
}

// Get current player position
function getPlayerPosition() {
  return playerPosition;
}

// Reset player to starting position
function resetPlayerPosition() {
  playerPosition = [1, 1];
}

// Initialize arrow key controls for player movement
function initializeArrowKeyControls(
  grid,
  onMovementCallback,
  movementAllowedCallback,
) {
  document.addEventListener("keydown", (event) => {
    // If a movementAllowedCallback is provided and it returns false, block movement
    if (movementAllowedCallback && !movementAllowedCallback()) return;

    let newRow = playerPosition[0];
    let newCol = playerPosition[1];

    // Map arrow keys to direction changes
    switch (event.key) {
      case "ArrowUp":
        newRow = playerPosition[0] - 1;
        event.preventDefault();
        break;
      case "ArrowDown":
        newRow = playerPosition[0] + 1;
        event.preventDefault();
        break;
      case "ArrowLeft":
        newCol = playerPosition[1] - 1;
        event.preventDefault();
        break;
      case "ArrowRight":
        newCol = playerPosition[1] + 1;
        event.preventDefault();
        break;
      default:
        return; // Not an arrow key, ignore
    }

    // Check if the target position is valid (not a wall - value 1)
    if (grid[newRow][newCol] !== 1) {
      playerPosition = [newRow, newCol];

      // Call the callback with the updated grid if provided
      if (onMovementCallback) {
        onMovementCallback(createPlayerGrid(grid));
      }
    }
  });
}

// Draw a red circle on the player's current position
function drawPlayerCircle(squareSize = 50) {
  // Calculate the center of the player's cell
  const centerX = playerPosition[1] * squareSize + squareSize / 2;
  const centerY = playerPosition[0] * squareSize + squareSize / 2;

  // Set circle properties
  fill(255, 0, 0); // Red fill
  stroke(139, 0, 0); // Dark red outline
  strokeWeight(2);

  // Draw the circle (diameter is about 80% of square size for visibility)
  circle(centerX, centerY, squareSize * 0.8);
}

// Draws on-screen controls text at the top while the game is active.
// Call with an explicit boolean `isActive` when available; otherwise
// it will fall back to a global `gameActive` or the p5 `loop` state.
function showControlsText(isActive, canvasWidth) {
  const active =
    typeof isActive === "boolean"
      ? isActive
      : typeof gameActive !== "undefined"
        ? gameActive
        : true;
  if (!active) return;

  const w =
    typeof canvasWidth === "number"
      ? canvasWidth
      : typeof width === "number"
        ? width
        : 400;

  push();
  textAlign(CENTER, TOP);
  textSize(16);
  fill(255); // white text
  stroke(0); // black outline for readability
  strokeWeight(3);
  text("Using the arrow keys, move the circle to the blue square!", w / 2, 10);
  pop();
}
