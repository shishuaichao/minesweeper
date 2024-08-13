function createBoard(rows, cols) {
  let board = [];
  for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < cols; c++) {
          row.push({
              hasMine: false,
              neighborMines: 0,
              revealed: false,
              flagged: false
          });
      }
      board.push(row);
  }
  return board;
}

function placeMines(board, numMines) {
  let rows = board.length;
  let cols = board[0].length;
  let placedMines = 0;

  while (placedMines < numMines) {
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * cols);

      if (!board[r][c].hasMine) {
          board[r][c].hasMine = true;
          placedMines++;
      }
  }
}

function calculateNeighborMines(board) {
  let rows = board.length;
  let cols = board[0].length;

  for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
          if (!board[r][c].hasMine) {
              let mineCount = 0;
              for (let i = -1; i <= 1; i++) {
                  for (let j = -1; j <= 1; j++) {
                      let newRow = r + i;
                      let newCol = c + j;
                      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].hasMine) {
                          mineCount++;
                      }
                  }
              }
              board[r][c].neighborMines = mineCount;
          }
      }
  }
}

function revealCell(board, r, c) {
  if (board[r][c].revealed || board[r][c].flagged) {
      return;
  }

  board[r][c].revealed = true;

  if (board[r][c].hasMine) {
      document.getElementById(`cell-${r}-${c}`).classList.add('mine');
      alert("Game Over!");
      return;
  }

  let cellElement = document.getElementById(`cell-${r}-${c}`);
  cellElement.classList.add('revealed');
  if (board[r][c].neighborMines > 0) {
      cellElement.textContent = board[r][c].neighborMines;
  }

  if (board[r][c].neighborMines === 0) {
      for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
              let newRow = r + i;
              let newCol = c + j;
              if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
                  revealCell(board, newRow, newCol);
              }
          }
      }
  }
}

function checkWin(board) {
  for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
          if (!board[r][c].hasMine && !board[r][c].revealed) {
              return false;
          }
      }
  }
  return true;
}

function renderBoard(board) {
  const boardElement = document.getElementById('board');
  boardElement.style.gridTemplateColumns = `repeat(${board[0].length}, 30px)`;

  for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
          const cellElement = document.createElement('div');
          cellElement.id = `cell-${r}-${c}`;
          cellElement.className = 'cell';
          cellElement.addEventListener('click', () => {
              revealCell(board, r, c);
              if (checkWin(board)) {
                  alert("You Win!");
              }
          });
          boardElement.appendChild(cellElement);
      }
  }
}

// Initialize the game
let rows = 10;
let cols = 10;
let numMines = 10;

let board = createBoard(rows, cols);
placeMines(board, numMines);
calculateNeighborMines(board);
renderBoard(board);
