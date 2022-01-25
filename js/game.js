'use strict'
const WALL = '<span class="wall"></span>'
const FOOD = '<span class="food"></span'
const EMPTY = ' ';
const SUPER_FOOD = '<span class="super-food"></span>'
const CHERRY = '🍒'
const WEAK_GHOST_COLOR = 'blue'

var gBoard;
var gGame = {
    score: 0,
    isOn: false,
    foodCount: 0,
    foodEaten: 0,
    intervals: [], // [0] = ghostInterval, [1] = cherryInterval, [2] = timerInterval
    timePassedInSeconds: 0
}

function init() {
    clearIntervals(gGame.intervals)
    document.querySelector('.live-time-display span').innerText = 0
    document.querySelector('.modal').style.display = 'none'
    gGame.intervals = []
    gGame.score = 0
    gGame.timePassedInSeconds = 0
    updateScore(0)
    gBoard = buildBoard()
    gGame.intervals[1] = setInterval(addCherry, 15000, gBoard)
    gGame.intervals[2] = setInterval(countTime, 1000)
    createPacman(gBoard);
    gGame.foodCount = countFoodInBoard(gBoard)
    gGame.foodEaten = 0
    createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    gGame.isOn = true

}

function buildBoard() {
    const SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
            }
        }
    }
    board[1][1] = SUPER_FOOD
    board[1][SIZE - 2] = SUPER_FOOD
    board[SIZE - 2][SIZE - 2] = SUPER_FOOD
    board[SIZE - 2][1] = SUPER_FOOD
    return board;
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff;
    document.querySelector('.score-display span').innerText = gGame.score;
}

function gameOver(isWin) {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.querySelector('.game-over span').innerText = (isWin) ? 'won!' : 'lose 💀'
    elModal.querySelector('.final-score span').innerText = gGame.score
    gGame.isOn = false;
    clearIntervals(gGame.intervals)
        // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
        // update the DOM
    renderCell(gPacman.location, EMPTY)
}

function countFoodInBoard(board) {
    var count = 0
    for (var i = 1; i < board.length - 1; i++) {
        for (var j = 1; j < board[0].length - 1; j++) {
            if (board[i][j] === FOOD) count++
        }
    }
    return count
}

function addCherry(board) {
    const emptySpaces = getEmptySpaces(board);
    if (!emptySpaces.length) return;
    const currEmptySpace = emptySpaces[getRandomIntInclusive(0, emptySpaces.length - 1)]
    board[currEmptySpace.i][currEmptySpace.j] = CHERRY
    renderCell(currEmptySpace, CHERRY)
}

function getEmptySpaces(mat) {
    var emptySpaces = [];
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            if (mat[i][j] === EMPTY) emptySpaces.push({ i, j })
        }
    }
    return emptySpaces;
}

function clearIntervals(intervals) {
    for (var i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i])
    }
}

function checkWin() {
    if (gGame.foodEaten === gGame.foodCount) gameOver(true)
}