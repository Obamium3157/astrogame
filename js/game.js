var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');

var GAME = {
    width: 500,
    height: 500,
    background: "#fff",
}

canvas.width = GAME.width;
canvas.height = GAME.height;

drawBackground();

function drawBackground() {
    canvasContext.fillStyle = GAME.background;
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}