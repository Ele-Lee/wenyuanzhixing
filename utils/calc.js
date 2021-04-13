export const getLandsNumFromGrid = function (grid) {
  const maxRow = grid.length;
  const maxLow = grid[0].length;

  const recordMap = {};

  function move(_arr, row, low) {
    if (
      row >= maxRow ||
      low >= maxLow ||
      row < 0 ||
      low < 0 ||
      grid[row][low] == 0
    ) {
      return false;
    }
    grid[row][low] = 0;
    recordMap[`${row}-${low}`] = 1;

    if (grid[row][low] == 1) {
      grid[row][low] += 1;
    }
    move(_arr, row + 1, low);
    move(_arr, row - 1, low);
    move(_arr, row, low - 1);
    move(_arr, row, low + 1);
  }

  let res = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] == 1) {
        res++;
        move(grid, i, j);
      }
    }
  }

  Object.keys(recordMap).forEach(k => {
    const tmp = k.split('-');
    grid[tmp[0]][tmp[1]] = 1;
  });

  return { num: res, recordMap };
};
