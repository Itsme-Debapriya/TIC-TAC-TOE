const cells = document.querySelectorAll(".cell");
const titleHeader = document.querySelector("#titleHeader");
const xPlayerDisplay = document.querySelector("#xPlayerDisplay");
const oPlayerDisplay = document.querySelector("#oPlayerDisplay");
const restartBtn = document.querySelector("#restartBtn");
const modeSwitchBtn = document.querySelector("#modeSwitchBtn");
const modeDescription = document.querySelector("#modeDescription");
const scoreDisplay = document.querySelector("#scoreDisplay");

// Initialize variables for the game
let player = "X";
let isPauseGame = false;
let isGameStart = false;
let gameMode = "PvC"; // Default mode is Player vs Computer
let xScore = 0; // Score for player X
let oScore = 0; // Score for player O

// Array to track cell states
const inputCells = ["", "", "", "", "", "", "", "", ""];

// Array of win conditions
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

// Add click event listeners to each cell
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => tapCell(cell, index));
});

function tapCell(cell, index) {
  // Ensure cell is empty and game isn't paused
  if (cell.textContent === "" && !isPauseGame) {
    isGameStart = true;
    updateCell(cell, index);

    // Always make restart button visible after first move
    restartBtn.style.visibility = "visible";

    // Check winner or continue game based on mode
    if (!checkWinner()) {
      if (gameMode === "PvC") {
        changePlayer();
        randomPick();
      } else {
        // PvP mode: simply change player
        changePlayer();
      }
    }
  }
}

function updateCell(cell, index) {
  cell.textContent = player;
  inputCells[index] = player;
  cell.style.color = player === "X" ? "#ed85be" : "#350dd6";
}

function changePlayer() {
  player = player === "X" ? "O" : "X";
}

function randomPick() {
  // Pause the game to allow computer to pick
  isPauseGame = true;

  setTimeout(() => {
    let randomIndex;
    do {
      // Pick a random index
      randomIndex = Math.floor(Math.random() * inputCells.length);
    } while (
      // Ensure the chosen cell is empty
      inputCells[randomIndex] !== ""
    );

    // Update the cell with computer move
    updateCell(cells[randomIndex], randomIndex);

    if (!checkWinner()) {
      changePlayer();
      // Switch to human player
      isPauseGame = false;
    }
  }, 1000); // Delay computer by 1 second
}

function checkWinner() {
  for (const [a, b, c] of winConditions) {
    // Check each winning condition
    if (
      inputCells[a] === player &&
      inputCells[b] === player &&
      inputCells[c] === player
    ) {
      declareWinner([a, b, c]);
      return true;
    }
  }

  // Check for a draw (if all cells are filled)
  if (inputCells.every((cell) => cell !== "")) {
    declareDraw();
    return true;
  }
  return false;
}

function declareWinner(winningIndices) {
  titleHeader.textContent = `${player} Wins!`;
  isPauseGame = true;

  // Highlight winning cells
  winningIndices.forEach((index) => {
    cells[index].classList.add("winner");
  });

  // Update scores
  if (player === "X") {
    xScore++;
  } else {
    oScore++;
  }
  updateScoreDisplay();

  // Restart button is already visible after first move
}

function declareDraw() {
  titleHeader.textContent = "It's a Draw!";
  isPauseGame = true;
  // Restart button is already visible after first move
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `X: ${xScore} | O: ${oScore}`;
}

function choosePlayer(selectedPlayer) {
  // Ensure the game hasn't started
  if (!isGameStart) {
    // Override the selected player value
    player = selectedPlayer;
    if (player === "X") {
      // Highlight X display
      xPlayerDisplay.classList.add("player-active");
      oPlayerDisplay.classList.remove("player-active");
    } else {
      // Highlight O display
      xPlayerDisplay.classList.remove("player-active");
      oPlayerDisplay.classList.add("player-active");
    }
  }
}

function switchGameMode() {
  // Toggle between PvP and PvC modes
  gameMode = gameMode === "PvP" ? "PvC" : "PvP";

  // Update button text and mode description
  if (gameMode === "PvP") {
    modeSwitchBtn.textContent = "Player vs Player";
    modeDescription.textContent =
      "Two players take turns. No computer opponent.";
  } else {
    modeSwitchBtn.textContent = "Player vs Computer";
    modeDescription.textContent = "Play against a computer with random moves.";
  }

  // Reset the game when switching modes
  restartGame();
}

function restartGame() {
  inputCells.fill("");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });
  isPauseGame = false;
  isGameStart = false;
  titleHeader.textContent = "Choose";
  player = "X";
  xPlayerDisplay.classList.add("player-active");
  oPlayerDisplay.classList.remove("player-active");
}

restartBtn.addEventListener("click", restartGame);
modeSwitchBtn.addEventListener("click", switchGameMode);

// Make restart button visible from the start
restartBtn.style.visibility = "visible";
