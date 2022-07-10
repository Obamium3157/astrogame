const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const GAME = {
    width: 1000,
    height: 600,
    background: "gray",
}

const PLAYER = {
    x: 20,
    y: 20,
    width: 50,
    height: 80,
    background: "red",
}

canvas.width = GAME.width;
canvas.height = GAME.height;

play();

function physics() {
    PLAYER.y += 7;
}

function drawBackground() {
    canvasContext.fillStyle = GAME.background;
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}

function drawPlayer() {
    canvasContext.fillStyle = PLAYER.background;
    canvasContext.fillRect(PLAYER.x, PLAYER.y, PLAYER.width, PLAYER.height);
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
}

function play() {
    drawFrame();
    physics();
    requestAnimationFrame(play)
}