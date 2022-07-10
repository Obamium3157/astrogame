var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');

var GAME = {
    width: 1000,
    height: 600,
    background: "gray",
}

canvas.width = GAME.width;
canvas.height = GAME.height;

drawBackground();

function drawBackground() {
    canvasContext.fillStyle = GAME.background;
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}