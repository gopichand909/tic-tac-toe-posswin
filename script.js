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
let cornerControl
let turn=0

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {

  circleTurn = false
  cellElements.forEach(cell => {
    turn=0
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()

  winningMessageElement.classList.remove('show')
}


function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass)
   turn++
  if (turn === 1) {
    const cellIndex = Array.from(cellElements).indexOf(cell);
    if (cellIndex % 2 === 0 && cellIndex!=4) {
      cornerControl = true;
    } else {
      cornerControl = false;
    }
    turn++;
  }
  if(cornerControl){
    cornerContro()
  }else{
    centerControl()
  }

  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true);
  } else {
    setBoardHoverClass();
  }
}


function cornerContro(){
  circleTurn = true
  let cellIndex = 2;
  if(posswin(CIRCLE_CLASS) != -1){
    cellIndex = posswin(CIRCLE_CLASS)
  }else if(posswin(X_CLASS) != -1){
    cellIndex = posswin(X_CLASS)
  }else{
    cellIndex=fillOval()
  }

  if(cellIndex==-1){
    if(isDraw()){
      endGame(true);
    }
  }
  const cell = cellElements[cellIndex]
  const currentClass = CIRCLE_CLASS
  placeMark(cell, currentClass)
  if(checkWin(currentClass)){
    endGame(false)
  }
  circleTurn = false

}

function centerControl(){
  circleTurn = true
  let cellIndex = 2;
  if(posswin(CIRCLE_CLASS) != -1){
    cellIndex = posswin(CIRCLE_CLASS)
  }else if(posswin(X_CLASS) != -1){
    cellIndex = posswin(X_CLASS)
  }else{
    cellIndex=fillCenter()
  }

  if(cellIndex==-1){
    if(isDraw()){
      endGame(true);
    }
  }
  const cell = cellElements[cellIndex]
  const currentClass = CIRCLE_CLASS
  placeMark(cell, currentClass)
  if(checkWin(currentClass)){
    endGame(false)
  }
  circleTurn = false
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
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


function posswin(currentClass) {
  let emptyCellIndex = 0;
  let winOnNextMove = false;

  for (const combination of WINNING_COMBINATIONS) {
    let countCurrentClass = 0;
    let emptyCell = 0;
    for (const index of combination) {
      if (cellElements[index].classList.contains(currentClass)) {
        countCurrentClass++;
      } else if (!cellElements[index].classList.contains(X_CLASS) && !cellElements[index].classList.contains(CIRCLE_CLASS)) {
        // If the cell is not marked with "X" or "O", consider it as an empty cell.
        emptyCell = index;
      }
    }

    if (countCurrentClass === 2 && emptyCell !== 0) {
      // If the player has two marks in the combination and there is an empty cell, they can win on the next move.
      emptyCellIndex = emptyCell;
      winOnNextMove = true;
      break;
    }
  }

  if (winOnNextMove) {
    return emptyCellIndex;
  } else {
    return -1;
  }
}

function fillOval() {
  const nonCornerCells = [4,1, 3, 5, 7,0,2, 6,8];
  if (cellElements[0].classList.contains(X_CLASS) && (cellElements[7].classList.contains(X_CLASS) ) && !cellElements[6].classList.contains(X_CLASS) && !cellElements[6].classList.contains(CIRCLE_CLASS) ) {
    return 6;
  }
  
  if (cellElements[2].classList.contains(X_CLASS) && cellElements[7].classList.contains(X_CLASS) && !cellElements[8].classList.contains(X_CLASS) && !cellElements[8].classList.contains(CIRCLE_CLASS) ) {
    return 8;
  }
  for (const index of nonCornerCells) {
    if (!cellElements[index].classList.contains(X_CLASS) && !cellElements[index].classList.contains(CIRCLE_CLASS)) {
      return index;
    }
  }

  return -1; // If no non-corner empty cell found
}

function fillCenter() {
  // Corner cells: [0, 2, 6, 8]
  const nonCenterCells = [4, 0,2, 6,8, 1, 3 , 5, 7];
  if (cellElements[0].classList.contains(X_CLASS) && (cellElements[7].classList.contains(X_CLASS) ) && !cellElements[6].classList.contains(X_CLASS) && !cellElements[6].classList.contains(CIRCLE_CLASS) ) {
    return 6;
  }
  
  if (cellElements[2].classList.contains(X_CLASS) && cellElements[7].classList.contains(X_CLASS) && !cellElements[8].classList.contains(X_CLASS) && !cellElements[8].classList.contains(CIRCLE_CLASS) ) {
    return 8;
  }
  if (cellElements[5].classList.contains(X_CLASS) && (cellElements[7].classList.contains(X_CLASS) || cellElements[6].classList.contains(X_CLASS)) && !cellElements[8].classList.contains(X_CLASS) && !cellElements[8].classList.contains(CIRCLE_CLASS) ) {
    return 8;
  }

  if (cellElements[1].classList.contains(X_CLASS) && (cellElements[3].classList.contains(X_CLASS) || cellElements[5].classList.contains(X_CLASS)) && !cellElements[4].classList.contains(X_CLASS) && !cellElements[4].classList.contains(CIRCLE_CLASS) ) {
    return 4;
  }

  for (const index of nonCenterCells) {
    if (!cellElements[index].classList.contains(X_CLASS) && !cellElements[index].classList.contains(CIRCLE_CLASS)) {
      return index;
    }
  }

  return -1; // If no non-corner empty cell found
}
