const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells (board[y][x])

/** makeBoard: create in-JS board structure */
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops */
function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");

  // create the top row for column clicks
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  htmlBoard.append(top);

  // create the main game board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }

    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next available spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} wins!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame("It's a tie!");
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;

  // update player turn indicator
  const playerTurn = document.getElementById("player-turn");
  playerTurn.textContent = `Player ${currPlayer}'s Turn`;
}
  
 

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Iterate through the board to check for wins
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // Check horizontal, vertical, diagonal down-right, diagonal up-right
      const horizontal = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vertical = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagonalDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagonalUR = [
        [y, x],
        [y - 1, x + 1],
        [y - 2, x + 2],
        [y - 3, x + 3],
      ];

      // Check if any of the possible win combinations have been achieved
      if (
        _win(horizontal) ||
        _win(vertical) ||
        _win(diagonalDR) ||
        _win(diagonalUR)
      ) {
        return true;
      }
    }
  }

  return false;
}

/** endGame: announce game end */
function endGame(message) {
  alert(message);
}

makeBoard();
makeHtmlBoard();

/** resetGame: reset the game to a new empty board */
function resetGame() {
  // Clear the board array
  board.length = 0;

  // Clear the HTML table
  const htmlBoard = document.querySelector("#board");
  htmlBoard.innerHTML = "";

  // Reset the player turn indicator
  currPlayer = 1;
  const playerTurn = document.getElementById("player-turn");
  playerTurn.textContent = `Player ${currPlayer}'s Turn`;

  // Create a new board and HTML table
  makeBoard();
  makeHtmlBoard();
}

// Add event listener to the New Game button
const newGameBtn = document.getElementById("new-game");
newGameBtn.addEventListener("click", resetGame);
