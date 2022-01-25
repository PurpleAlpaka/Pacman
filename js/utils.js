'use strict'

function printMat(mat, selector) {
    var strHTML = '<table class="board" border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell-' + i + '-' + j;
            strHTML += '<td class="' + className + '">' + cell + '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function countTime() {
    var display = ''
    gGame.timePassedInSeconds++
        if (gGame.timePassedInSeconds > 60) {
            const seconds = ((gGame.timePassedInSeconds % 60) < 10) ? '0' + gGame.timePassedInSeconds % 60 : gGame.timePassedInSeconds % 60
            display = parseInt(gGame.timePassedInSeconds / 60) + ' : ' + seconds
        } else display = gGame.timePassedInSeconds
            // document.querySelector('.live-time-display span').innerText = display
    document.querySelector('.time-display span').innerText = display
    document.querySelector('.live-time-display span').innerText = display
}