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
    intervals: [] // [0] = ghostInterval, [1] = cherryInterval
}

function init() {
    console.log('gGame', gGame)
    clearIntervals(gGame.intervals)
    document.querySelector('.modal').style.display = 'none'
    gGame.intervals = []
    gGame.score = 0
    updateScore(0)
    gBoard = buildBoard()
    gGame.intervals[1] = setInterval(addCherry, 15000, gBoard)
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
    document.querySelector('h2 span').innerText = gGame.score;
}

function gameOver(isWin) {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    elModal.querySelector('h1 span').innerText = (isWin) ? 'You won!' : 'You lose :c'
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
            var cell = board[i][j]
            if (board[i][j] === FOOD) count++
        }
    }
    console.log('count', count)

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
    // console.log('gGame.foodEaten', gGame.foodEaten)
    // console.log('gGame.foodCount', gGame.foodCount)

    if (gGame.foodEaten === gGame.foodCount) gameOver(true)
}