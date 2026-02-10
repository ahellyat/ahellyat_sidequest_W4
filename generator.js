// Array generator function
function generateArray(rows = 10, cols = 10) {
  let grid = [];

  // Initialize grid with borders and interior cells
  for (let i = 0; i < rows; i++) {
    grid[i] = [];

    for (let j = 0; j < cols; j++) {
      // Set border to 1, inside to 0
      if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
        grid[i][j] = 1;
      } else {
        grid[i][j] = 0;
      }
    }
  }

  // Mark start and end positions
  grid[1][1] = 2;
  grid[rows - 2][cols - 2] = 3;

  // Find guaranteed path from 2 to 3
  let path = findPath(grid, 1, 1, rows - 2, cols - 2);
  let pathSet = new Set(path.map((p) => `${p[0]},${p[1]}`));

  // Fill interior with random 1's and 0's, keeping path as 0's
  for (let i = 1; i < rows - 1; i++) {
    for (let j = 1; j < cols - 1; j++) {
      let key = `${i},${j}`;

      // Keep start (2) and end (3) markers unchanged
      if (grid[i][j] === 2 || grid[i][j] === 3) {
        continue;
      }

      // Keep path cells as 0
      if (pathSet.has(key)) {
        grid[i][j] = 0;
      } else {
        // Randomly fill remaining cells with 0 or 1
        grid[i][j] = Math.random() < 0.5 ? 0 : 1;
      }
    }
  }

  return grid;
}

// Randomized DFS pathfinding with BFS fallback to ensure varied paths
function findPath(arr, startRow, startCol, endRow, endCol) {
  let rows = arr.length;
  let cols = arr[0].length;

  const key = (r, c) => `${r},${c}`;

  // Shuffle helper
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }

  // Randomized DFS (iterative) to try producing a random simple path
  let stack = [[startRow, startCol]];
  let parent = {};
  let visited = new Set([key(startRow, startCol)]);

  while (stack.length > 0) {
    let [r, c] = stack.pop();

    if (r === endRow && c === endCol) break;

    let neighbors = [
      [r - 1, c], // up
      [r + 1, c], // down
      [r, c - 1], // left
      [r, c + 1], // right
    ];

    shuffle(neighbors);

    for (let [nR, nC] of neighbors) {
      if (nR < 1 || nR >= rows - 1 || nC < 1 || nC >= cols - 1) continue;
      let nKey = key(nR, nC);
      if (visited.has(nKey)) continue;
      visited.add(nKey);
      parent[nKey] = [r, c];
      stack.push([nR, nC]);
    }
  }

  // If randomized DFS found a path, reconstruct it
  if (
    parent[key(endRow, endCol)] ||
    (startRow === endRow && startCol === endCol)
  ) {
    let path = [];
    let curr = [endRow, endCol];
    while (curr) {
      path.unshift(curr);
      const p = parent[key(curr[0], curr[1])];
      if (!p) break;
      curr = p;
    }
    // Ensure path starts at start
    if (path.length > 0 && path[0][0] === startRow && path[0][1] === startCol)
      return path;
  }

  // Fallback to BFS (guaranteed shortest path) if DFS fails
  let queue = [[startRow, startCol]];
  let bVisited = {};
  let bParent = {};
  bVisited[key(startRow, startCol)] = true;

  while (queue.length > 0) {
    let [r, c] = queue.shift();
    if (r === endRow && c === endCol) {
      let path = [];
      let curr = [endRow, endCol];
      while (curr) {
        path.unshift(curr);
        curr = bParent[key(curr[0], curr[1])];
      }
      return path;
    }

    let neighbors = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];

    shuffle(neighbors);

    for (let [nR, nC] of neighbors) {
      if (nR < 1 || nR >= rows - 1 || nC < 1 || nC >= cols - 1) continue;
      let nKey = key(nR, nC);
      if (!bVisited[nKey]) {
        bVisited[nKey] = true;
        bParent[nKey] = [r, c];
        queue.push([nR, nC]);
      }
    }
  }

  // Last resort: direct connection
  return [
    [startRow, startCol],
    [endRow, endCol],
  ];
}
