// Function to render a 2D level array as a grid of colored rectangles
function drawLevel(levelArray) {
  // Check if array exists
  if (!levelArray || levelArray.length === 0) {
    console.error("Invalid level array");
    return;
  }

  const SQUARE_SIZE = 50;
  const rows = levelArray.length;
  const cols = levelArray[0].length;

  stroke(0);
  strokeWeight(1);

  // Iterate through each cell in the array
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Calculate position
      const x = j * SQUARE_SIZE;
      const y = i * SQUARE_SIZE;

      // Set color based on array value
      const cellValue = levelArray[i][j];
      switch (cellValue) {
        case 1:
          fill(0); // Black
          break;
        case 0:
          fill(255); // White
          break;
        case 2:
          fill(0, 255, 0); // Green
          break;
        case 3:
          fill(0, 0, 255); // Blue
          break;
        default:
          fill(200); // Gray for unknown values
      }

      // Draw the rectangle
      rect(x, y, SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}
