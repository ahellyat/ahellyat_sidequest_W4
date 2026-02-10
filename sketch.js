// Array generator function
function generateArray(rows = 10, cols = 10) {
  let arr = [];

  // Initialize grid with borders and interior cells
  for (let i = 0; i < rows; i++) {
    arr[i] = [];

    for (let j = 0; j < cols; j++) {
      // Set border to 1, inside to 0
      if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
        arr[i][j] = 1;
      } else {
        arr[i][j] = 0;
      }
    }
  }

  // Mark start and end positions
  arr[1][1] = 2;
  arr[rows - 2][cols - 2] = 3;

  // Find guaranteed path from 2 to 3
  let path = findPath(arr, 1, 1, rows - 2, cols - 2);
  let pathSet = new Set(path.map((p) => `${p[0]},${p[1]}`));

  // Fill interior with random 1's and 0's, keeping path as 0's
  for (let i = 1; i < rows - 1; i++) {
    for (let j = 1; j < cols - 1; j++) {
      let key = `${i},${j}`;

      // Keep start (2) and end (3) markers unchanged
      if (arr[i][j] === 2 || arr[i][j] === 3) {
        continue;
      }

      // Keep path cells as 0
      if (pathSet.has(key)) {
        arr[i][j] = 0;
      } else {
        // Randomly fill remaining cells with 0 or 1
        arr[i][j] = Math.random() < 0.5 ? 0 : 1;
      }
    }
  }

  return arr;
}

// BFS pathfinding to create guaranteed path from start to end
function findPath(arr, startRow, startCol, endRow, endCol) {
  let rows = arr.length;
  let cols = arr[0].length;

  let queue = [[startRow, startCol]];
  let visited = {};
  let parent = {};

  let key = (r, c) => `${r},${c}`;
  visited[key(startRow, startCol)] = true;

  while (queue.length > 0) {
    let [r, c] = queue.shift();

    // Found the end position
    if (r === endRow && c === endCol) {
      let path = [];
      let curr = [endRow, endCol];

      // Reconstruct path
      while (curr) {
        path.unshift(curr);
        curr = parent[key(curr[0], curr[1])];
      }
      return path;
    }

    // Check all 4 cardinal directions
    let neighbors = [
      [r - 1, c], // up
      [r + 1, c], // down
      [r, c - 1], // left
      [r, c + 1], // right
    ];

    for (let [nR, nC] of neighbors) {
      // Stay within interior bounds (not on border)
      if (nR < 1 || nR >= rows - 1 || nC < 1 || nC >= cols - 1) continue;

      let nKey = key(nR, nC);
      if (!visited[nKey]) {
        visited[nKey] = true;
        parent[nKey] = [r, c];
        queue.push([nR, nC]);
      }
    }
  }

  // Fallback path
  return [
    [startRow, startCol],
    [endRow, endCol],
  ];
}

// Example usage
let grid = generateArray(10, 10);
console.log(grid);
