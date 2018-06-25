/**
 * Helps reduce diagonal win checks
 *
 * @returns {boolean}
 */
export function boardHasCenter(board_width) {
  return board_width % 2 === 1;
}

/**
 * Gets the index value of each corner of the square/board
 */
export function getCorners(board_width, square_count) {
  //corner 1
  let corners = [0];
  //corner 2
  corners.push(board_width - 1);
  //corner 3
  corners.push(square_count - 1 - (board_width - 1));
  //corner 4
  corners.push(square_count - 1);

  return corners;
}

/**
 * Gets the square's diagonal indexes
 *
 * @returns {[null,null]}
 */
export function getDiagSquareIndexes(board_width, square_count) {
  let diag_one = [];
  let diag_two = [];
  let result = [diag_one, diag_two];

  for (let i = 0; i <= square_count - 1; i += board_width + 1) {
    diag_one.push(i);
  }

  for (
    let d = board_width - 1;
    d <= square_count - board_width;
    d += board_width - 1
  ) {
    diag_two.push(d);
  }

  return result;
}

/**
 * Splits an array into chunks given a size
 *
 * @param arr
 * @param chunk_size
 * @returns {Array}
 */
export function chunkArray(arr, chunk_size) {
  let chunk;
  let chunks = [];

  for (let i = 0; i < arr.length; i += chunk_size) {
    chunk = arr.slice(i, i + chunk_size);
    chunks.push(chunk);
  }

  return chunks;
}

/**
 * Creates the initial board's data structure
 *
 * @param square_length
 * @returns {Array}
 */
export function create_square_data_set(square_length) {
  let data_set = [];
  let row = 1;
  let column = 1;

  for (let x = 0; x < square_length; x++) {
    for (let i = 0; i < square_length; i++) {
      data_set.push({
        position: {
          row: row,
          column: column
        },
        player: null
      });
      column++;
    }
    row++;
    column = 1;
  }

  return data_set;
}

/**
 * Limit the board width to a range (min, max)
 *
 * @param board_width
 * @param min
 * @param max
 * @returns {number}
 */
export function boardWidthMinMax(board_width, min, max) {
  return Math.min(Math.max(board_width, min), max);
}
