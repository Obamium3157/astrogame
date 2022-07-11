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
    fallSpeed: 1,
    width: 50,
    height: 80,
    canJump: true,
    jumpLength: 200,
    background: "pink",
    moveType: 'none',
}

const PADDLE = {
    x: 200,
    y: 400,
    width: 300,
    height: 40,
    color: "#fff",
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
        if(event.code === "KeyP") {
            PLAYER.moveType = 'none';
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

function drawPaddle() {
    canvasContext.fillStyle = PADDLE.color;
    canvasContext.fillRect(PADDLE.x, PADDLE.y, PADDLE.width, PADDLE.height);
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
    drawPaddle();
}

function updatePlayer() {
    /*FIXME: Починить коллизию с правым краем платформы!*/
    // Проверка коллизии с платформой (наступил сверху)
    if((PLAYER.y + PLAYER.height > PADDLE.y) && (PADDLE.x <= PLAYER.x && PLAYER.x <= PADDLE.x + PADDLE.width) && (PLAYER.x <= PADDLE.x + PADDLE.width)){
        PLAYER.y = PADDLE.y - 2 * PADDLE.height;
        PLAYER.canJump = true;
    }
    // Проверка коллизии с левым краем платформы
     if(((PLAYER.x + PLAYER.width >= PADDLE.x) && (PLAYER.x + PLAYER.width < PADDLE.x + PADDLE.width/2))  && (PADDLE.y <= PLAYER.y+PLAYER.height-1) && (PADDLE.y+PADDLE.height > PLAYER.y)) {
         PLAYER.x = PADDLE.x - PLAYER.width;
     }

    //  // Проверка коллизии с правым краем платформы
    if(((PLAYER.x <= PADDLE.x+PADDLE.width) && (PLAYER.x > PADDLE.x + PADDLE.width/2)) && (PADDLE.y <= PLAYER.y+PLAYER.height-1) && (PADDLE.y+PADDLE.height > PLAYER.y)) {
        PLAYER.x = 60;
    }
}

function play() {
    drawFrame();
    physics();
    updatePlayer();
    if(PLAYER.moveType === 'jump') {
        if(jump_pos !== PLAYER.jumpLength) {
            PLAYER.canJump = false
            PLAYER.y -= 25;
            jump_pos += 25;
        }
        if(jump_pos === PLAYER.jumpLength && PLAYER.canJump) {
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