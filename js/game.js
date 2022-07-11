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
    moveSpeed: 5,
    fallSpeed: 3,
    width: 50,
    height: 80,
    jumpLength: 200,
    background: "red",
    moveType: 'none',
}

canvas.width = GAME.width;
canvas.height = GAME.height;

initEventListener();
var jump_pos = 0;
play();

function initEventListener() {
    window.addEventListener("keydown", function (event) {
        // let dt = getDeltaTime();
        if(event.code === "KeyW") {
            PLAYER.moveType = 'jump';
            // PLAYER.y = 4 * PLAYER.jumpLength * Math.sin(Math.PI)
        }
        if(event.code === "KeyA") {
            PLAYER.moveType = 'left';
        }
        if(event.code === "KeyS") {
            return;
        }
        if(event.code === "KeyD") {
            PLAYER.moveType = "right"
        }
        if(event.code === "KeySpace") {
            return;
        }

        if(!event.code) {
            PLAYER.moveType = 'none';
        }
    })
}

function physics() {
    PLAYER.y += PLAYER.fallSpeed;
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
    if(PLAYER.moveType === 'jump') {
        if(jump_pos !== PLAYER.jumpLength) {
            PLAYER.y -= 5;
            jump_pos += 5;
        }
        if(jump_pos === PLAYER.jumpLength) {
            jump_pos = 0;
        }
    }
    if(PLAYER.moveType === 'left') {
        PLAYER.x -= PLAYER.moveSpeed;
    }
    if(PLAYER.moveType === 'right') {
        PLAYER.x += PLAYER.moveSpeed;
    }


    requestAnimationFrame(play)
}