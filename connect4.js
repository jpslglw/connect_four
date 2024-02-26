/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(pl1, pl2, HEIGHT = 6, WIDTH = 7) { // setting width and height in js-file
    this.players = [pl1, pl2]; // define players with players created with player class
    this.currPlayer = pl1; // pl1 starts (first entry)
    this.width = WIDTH;
    this.height = HEIGHT;
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard(); // create array board and HTML board (table, visual representation)
  }
  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width })); // creating array with 6 by 7 board
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board'); // make the board as table
    board.innerHTML = ''; // reset the board
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'columnTop');

    this.handleClickBound = this.handleClick.bind(this); // binding this
    top.addEventListener('click', this.handleClickBound); // make top row reactive

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top); 
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color; // use the player color as color of the piece
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#columnTop");
    top.removeEventListener("click", this.handleClickBound); 
  }
  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0]; // switching players by using the players array
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const _win = cells => // since this is an arrow function, this will refer to object it is called in
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color){
    this.color = color; // using the input color from user
  }
}

document.getElementById('startGame').addEventListener('click', () => {
  let pl1 = new Player(document.getElementById('pColor1').value);
  let pl2 = new Player(document.getElementById('pColor2').value); // collecting the color inputs
  new Game(pl1, pl2); // initiating the game
});
