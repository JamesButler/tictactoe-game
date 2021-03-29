const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
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
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn

var tieCounter = 0;
var xCounter = 0;
var oCounter = 0;

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
  circleTurn = false
  document.getElementById("indicator").innerHTML = "X Starts";
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

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

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

function swapTurns() {
  if (circleTurn) {
    document.getElementById("indicator").innerHTML = "X's Turn";
  }
  else {
    document.getElementById("indicator").innerHTML = "O's Turn";
  }
  circleTurn = !circleTurn
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(CIRCLE_CLASS)
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}

function applyTheme(theme) {
  document.body.classList.remove("theme-light", "theme-dark");
  
  document.body.classList.add(`theme-${theme}`);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#selTheme").addEventListener("change", function () {
    applyTheme(this.value);
  });
});
