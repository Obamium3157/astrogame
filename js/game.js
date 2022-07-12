//TODO: Починить коллизию (персонаж не должен оказываться на платформе, если он под ней)
//TODO: Сделать механику стрельбы
//TODO: Добавить противников
//TODO: Добавить спрайты

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const GAME = {
    width: 1000,
    height: 600,
    background: 'gray',
}

const PLAYER = {
    x: 20,
    y: 200,
    moveSpeed: 5,
    fallSpeed: 2,
    width: 50,
    height: 80,
    canJump: true,
    jump_pos: 0,
    jumpLength: 275, // 200
    background: "pink",
    moveType: 'none',
}

const PADDLE_LAYOUT = {
    x: GAME.width,
    y: getRandomHeight(),
    width: 300,
    height: 40,
    moveSpeed: 2,
    color: "#fff",
}

class Paddle {
    constructor() {
        this.x = PADDLE_LAYOUT.x;
        this.y = getRandomHeight();
        this.width = PADDLE_LAYOUT.width;
        this.height = PADDLE_LAYOUT.height;
        this.moveSpeed = PADDLE_LAYOUT.moveSpeed;
        this.color = PADDLE_LAYOUT.color;
    }

    move() {
        this.x -= this.moveSpeed;
    }
}

canvas.width = GAME.width;
canvas.height = GAME.height;

const paddles = [];
var startPaddle = new Paddle();
var secondPaddle = new Paddle();
var thirdPaddle = new Paddle();

startPaddle.y = PLAYER.y;
startPaddle.x = PLAYER.x;

secondPaddle.x = GAME.width/2 - PADDLE_LAYOUT.width/2;
secondPaddle.y = GAME.height/2;

thirdPaddle.x = secondPaddle.x + secondPaddle.width;
thirdPaddle.y = 450;

paddles.push(startPaddle);
paddles.push(secondPaddle);
paddles.push(thirdPaddle);
paddles.push(new Paddle());

initEventListener();
play();

function getRandomHeight() {
    let arr = [100, 150, 200, 250, 300, 350, 400, 450]
    return arr[Math.floor(Math.random() * arr.length)]
}

function initEventListener() {
    window.addEventListener("keydown", function (event) {
        // let dt = getDeltaTime();
        if (event.code === "KeyW") {
            PLAYER.moveType = 'jump';
            // PLAYER.y = 4 * PLAYER.jumpLength * Math.sin(Math.PI)
        }
        if (event.code === "KeyA") {
            PLAYER.moveType = 'left';
        }
        if (event.code === "KeyS") {
            return;
        }
        if (event.code === "KeyD") {
            PLAYER.moveType = "right"
        }
        if (event.code === "KeySpace") {
            return;
        }
        if (event.code === "KeyP") {
            PLAYER.moveType = 'none';
        }

        if (!event.code) {
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
    for(let i = 0; i < paddles.length; i++) {
        let paddle = paddles[i]
        canvasContext.fillStyle = paddle.color;
        canvasContext.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
    drawPaddle();
}

function updatePlayer(paddle, x, y, width, height) {
    /*FIXME: Починить коллизию с правым краем платформы!*/
    // Проверка коллизии с платформой (наступил сверху)
    if ((PLAYER.y + PLAYER.height > y) && (x <= PLAYER.x && PLAYER.x <= x + width) && (PLAYER.x <= x + width)) {
        PLAYER.y = paddle.y - 2 * paddle.height;
        PLAYER.canJump = true;
    }
    // Проверка коллизии с левым краем платформы
    if (((PLAYER.x + PLAYER.width >= x) && (PLAYER.x + PLAYER.width < x + width / 2)) && (y <= PLAYER.y + PLAYER.height - 1) && (y + height > PLAYER.y)) {
        PLAYER.x = x - PLAYER.width;
    }

    //  // Проверка коллизии с правым краем платформы
    if (((PLAYER.x <= x + width) && (PLAYER.x > x + width / 2)) && (y <= PLAYER.y + PLAYER.height - 1) && (y + height > PLAYER.y)) {
        PLAYER.x = 60;
    }
}

function play() {
    for(let i = 0; i < paddles.length; i++) {
        updatePlayer(paddles[i], paddles[i].x, paddles[i].y, paddles[i].width, paddles[i].height)
        drawFrame();
        paddles[i].move();

        if(paddles[i].x + paddles[i].width < 0) {
            paddles[i].x = GAME.width;
            paddles[i].y = getRandomHeight();
        }

    }
    physics();
    if (PLAYER.moveType === 'jump') {
        if (PLAYER.jump_pos !== PLAYER.jumpLength) {
            PLAYER.canJump = false
            PLAYER.y -= 25;
            PLAYER.jump_pos += 25;
        }
        if (PLAYER.jump_pos === PLAYER.jumpLength && PLAYER.canJump) {
            PLAYER.jump_pos = 0;
        }
    }
    if (PLAYER.moveType === 'left') {
        PLAYER.x -= PLAYER.moveSpeed;
    }
    if (PLAYER.moveType === 'right') {
        PLAYER.x += PLAYER.moveSpeed;
    }

    requestAnimationFrame(play)
}