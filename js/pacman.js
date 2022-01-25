'use strict'
const PACMAN = getPacmanHTML('ArrowLeft');

var gPacman;

function createPacman(board) {
    gPacman = {
        location: {
            i: board.length - 2,
            j: 3
        },
        isSuper: false,
        isStandingOnSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
    if (ev.code === 'KeyR') return init()
    const validCodes = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']
    var isValidCode = false
    for (var i = 0; i < validCodes.length; i++) {
        if (ev.code === validCodes[i]) {
            isValidCode = true
            break
        }
    }
    if (!gGame.isOn || !isValidCode) return
        // use getNextLocation(), nextCell
    const eventCode = ev.code
    const nextLocation = getNextLocation(eventCode)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]
        // return if cannot move
    if (nextCell === WALL) return
        // hitting a ghost?  call gameOver
    const currCellContents = (gPacman.isStandingOnSuper) ? SUPER_FOOD : EMPTY
    gPacman.isStandingOnSuper = false
    if (nextCell === GHOST) {
        if (gPacman.isSuper) killGhost(getGhostIdx(nextLocation))
        else return gameOver(false);
    } else if (nextCell === FOOD) {
        updateScore(1)
        gGame.foodEaten++
            checkWin()
    } else if (nextCell === SUPER_FOOD) {
        if (!gPacman.isSuper) {
            updateScore(10)
            togglePacmanAsSuper()
        } else gPacman.isStandingOnSuper = true
    } else if (nextCell === CHERRY) updateScore(10)
        // moving from corrent position:
        // update the model 
    gBoard[gPacman.location.i][gPacman.location.j] = currCellContents
        // update the DOM
    renderCell(gPacman.location, currCellContents)

    // Move the pacman to new location
    // update the model
    gPacman.location = {
        i: nextLocation.i,
        j: nextLocation.j
    }
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
        // update the DOM
    renderCell(gPacman.location, getPacmanHTML(eventCode))
}

function getNextLocation(eventCode) {
    // figure out nextLocation
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }

    const elPacman = document.querySelector('.pacman')
    switch (eventCode) {
        case 'ArrowUp':
            nextLocation.i--
                break;
        case 'ArrowDown':
            nextLocation.i++
                break;
        case 'ArrowLeft':
            nextLocation.j--
                break;
        case 'ArrowRight':
            nextLocation.j++
                break;
        default:
            return null
    }
    return nextLocation;
}

function getPacmanHTML(direction) {
    var deg
    switch (direction) {
        case 'ArrowUp':
            deg = '90'
            break;
        case 'ArrowDown':
            deg = '270'
            break
        case 'ArrowRight':
            deg = '180'
            break
        case 'ArrowLeft':
            deg = '0'
            break
    }
    deg += 'deg'
    return `<span class="pacman" style="transform: rotate(${deg})"></span>`
}

function togglePacmanAsSuper() {
    gPacman.isSuper = !gPacman.isSuper
    if (gPacman.isSuper) {
        setTimeout(togglePacmanAsSuper, 5000)
    } else reviveGhosts()
}