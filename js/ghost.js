'use strict'
const GHOST = '&#9781;';
var gGhosts;
var gDeadGhosts = []

function createGhost(board) {
    var ghost = {
            location: {
                i: getRandomIntInclusive(2, board.length - 3),
                j: getRandomIntInclusive(2, board[0].length - 3)
            },
            currCellContent: FOOD,
            color: getRandomColor()
        }
        // gGame.foodCount++
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = getGhostHTML(ghost);
}

function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = [];
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }

    gGame.intervals[0] = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // figure out moveDiff, nextLocation, nextCell
    var moveDiff = getMoveDiff()
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j,
    }
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
        // return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
        // hitting a pacman?  call gameOver
    if (nextCell === PACMAN) {
        if (gPacman.isSuper) return
        return gameOver()
    }

    // moving from corrent position:
    // update the model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        // update the DOM
    renderCell(ghost.location, ghost.currCellContent)
    if (gPacman.isSuper && nextCell === PACMAN) return
        // Move the ghost to new location
        // update the model
    ghost.location = {
        i: nextLocation.i,
        j: nextLocation.j
    }
    ghost.currCellContent = nextCell
    gBoard[ghost.location.i][ghost.location.j] = GHOST
        // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getGhostHTML(ghost) {
    const ghostColor = (gPacman.isSuper) ? WEAK_GHOST_COLOR : ghost.color
    return `<span style="color:${ghostColor}">${GHOST}</span>`
}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(1, 100);
    if (randNum <= 25) {
        return { i: 0, j: 1 }
    } else if (randNum <= 50) {
        return { i: -1, j: 0 }
    } else if (randNum <= 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

// function toggleGhostsColor() {
//     for (var i = 0; i < gGhosts.length; i++) {
//         gGhosts[i].color = (gGhosts[i].color === gGhosts[i].ogColor) ? WEAK_GHOST_COLOR : gGhosts[i].ogColor
//         renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
//     }
// }

function getGhostIdxByLocation(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i &&
            gGhosts[i].location.j === location.j) {
            return i;
        }
    }
    return null;
}

function killGhost(ghostIdx) {
    switch (gGhosts[ghostIdx].currCellContent) {
        case FOOD:
            updateScore(1)
            gGame.foodEaten++;
            checkWin()
            break
        case CHERRY:
            updateScore(10)
            break
        case SUPER_FOOD:
            updateScore(10)
            if (!gPacman.isSuper) togglePacmanAsSuper()
            else gPacman.isStandingOnSuper = true
            break
    }
    gGhosts[ghostIdx].currCellContent = EMPTY
    gDeadGhosts.push(gGhosts.splice(ghostIdx, 1)[0])
}

function reviveGhosts() {
    // Works in console, dosen't work in code
    // gGhosts.concat(gDeadGhosts)
    // gDeadGhosts = []
    for (var i = gDeadGhosts.length - 1; i >= 0; i--) {
        gGhosts.push(gDeadGhosts.pop())
    }
}