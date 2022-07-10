const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const GAME = {
    width: 1000,
    height: 600,
    background: "gray",
}

const PLAYER = {
    x: 20,
    y: 200,
    width: 50,
    height: 80,
    background: "red",
    isJumping: false
}

canvas.width = GAME.width;
canvas.height = GAME.height;

initEventListener();
play();

function initEventListener() {
    window.addEventListener("keydown", function (event) {
        if(event.code === "KeyW") {
            PLAYER.y -= 125;
        }
        if(event.code === "KeyA") {
            PLAYER.x -= 15;
        }
        if(event.code === "KeyS") {
            return;
        }
        if(event.code === "KeyD") {
            PLAYER.x += 15;
        }
        if(event.code === "KeySpace") {
            return;
        }
    })
}

function physics() {
    PLAYER.y += 5;
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
    if(!PLAYER.isJumping)
        physics();
    requestAnimationFrame(play)
}