// shape classes
const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'

// game winning combinations
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
// game-board elements
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn

// score counters
var tieCounter = 0;
var xCounter = 0;
var oCounter = 0;

// function call to run & restart game
startGame()
restartButton.addEventListener('click', startGame)

// main game function
function startGame() {
  // game starts with X but O will start if their score is lower
  if (xCounter > oCounter) {
    circleTurn = true;
    document.getElementById("indicator").innerHTML = "O Starts";
  }
  else {
    circleTurn = false;
    document.getElementById("indicator").innerHTML = "X Starts";
  }

  // game-board setup
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

// handles game input & checks if game won
function handleClick(e) {
  const cell = e.target
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
  placeMark(cell, currentClass)
  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
  }
}

// when called ends game & displays end game message + updates counters
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Tie!'
    tieCounter += 1;
    document.getElementById("tieScore").innerHTML = tieCounter;
  } 
  else {
    winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`
    if (circleTurn) {
      oCounter += 1;
      document.getElementById("oScore").innerHTML = oCounter;
    }
    else {
      xCounter += 1;
      document.getElementById("xScore").innerHTML = xCounter;
    }
  }
  winningMessageElement.classList.add('show')
}

// checks if game is a tie
function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
  })
}

// function to place "game piece"
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

// alternates turns & updates indicator
function swapTurns() {
  if (circleTurn) {
    document.getElementById("indicator").innerHTML = getParameterByName(window.location.href, playerOne) + "'s Turn (X)";
  }
  else {
    document.getElementById("indicator").innerHTML = getParameterByName(window.location.href, playerTwo) + "'s Turn (O)";
  }
  circleTurn = !circleTurn
}

// for highlighting game pieces before placement
function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(CIRCLE_CLASS)
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

// cross checks winning combinations with current board
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}

// switches between light & dark depending on selector choice or local storage
function applyTheme(theme) {
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(`theme-${theme}`);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";

  applyTheme(savedTheme);

  for (const optionElement of document.querySelectorAll("#selTheme option")) {
    optionElement.selected = savedTheme === optionElement.value;
  }

  document.querySelector("#selTheme").addEventListener("change", function () {
    localStorage.setItem("theme", this.value);
    applyTheme(this.value);
  });
});