//TODO: Добавить спрайты

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const GAME = {
    width: 1000,
    height: 600,
    background: new Image(),
    isOver: false,
}

const PLAYER = {
    x: 20,
    y: 200,
    moveSpeed: 5,
    fallSpeed: 2,
    width: 50,
    height: 80,
    canJump: true,
    isInAir: false,
    jump_pos: 0,
    jumpLength: 325,
    background: "pink",
    moveType: 'none',
    attackRange: 70,
    score: 0,
    img: new Image(),
    imgSrc: '/img/Player.png',
}
PLAYER.img.src = PLAYER.imgSrc;

const PLAYER_MOVE = {
    img: new Image(),
    imgIsLoad: false,
    count: 0,
    size: 50,
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

        this.hasEnemy = generateEnemy();
    }

    move() {
        this.x -= this.moveSpeed;
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = PLAYER.width;
        this.height = PLAYER.height;
        this.color = 'red';

        this.hp = 1;
        this.isAlive = true;
    }
}

canvas.width = GAME.width;
canvas.height = GAME.height;

const paddles = [];
var startPaddle = new Paddle();
var secondPaddle = new Paddle();
var thirdPaddle = new Paddle();

startPaddle.y = PLAYER.y + 10;
startPaddle.x = PLAYER.x - PLAYER.width/2;

startPaddle.hasEnemy = false;

secondPaddle.x = GAME.width/2 - PADDLE_LAYOUT.width/2;
secondPaddle.y = GAME.height/2;

thirdPaddle.x = secondPaddle.x + secondPaddle.width;
thirdPaddle.y = 450;

paddles.push(startPaddle);
paddles.push(secondPaddle);
paddles.push(thirdPaddle);
paddles.push(new Paddle());

initAnimation();
initEventListener();
play();

function getRandomHeight() {
    let arr = [100, 150, 200, 250, 300, 350, 400, 450]
    return arr[Math.floor(Math.random() * arr.length)]
}

function generateEnemy() {
    return Math.floor(Math.random() * 2) === 0;
}

function initAnimation() {
    PLAYER_MOVE.img.src = 'img/Player.png';
    PLAYER_MOVE.img.onload = () => {
        PLAYER_MOVE.imgIsLoad = true;
    }
}

function initEventListener() {
    window.addEventListener("keydown", function (event) {
        // let dt = getDeltaTime();
        if (event.code === "KeyW") {
                PLAYER.moveType = 'jump';
        }
        if (event.code === "KeyA") {
            PLAYER.moveType = 'left';
        }
        if (event.code === "KeyS") {
            if(PLAYER.isInAir) {
                PLAYER.moveType = 'down';
            }
        }
        if (event.code === "KeyD") {
            PLAYER.moveType = "right";
        }
        if (event.keyCode === 32) {
            PLAYER.moveType = 'punch'
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

function drawPlayer() {
    canvasContext.fillStyle = PLAYER.background;
    canvasContext.fillRect(PLAYER.x, PLAYER.y, PLAYER.width, PLAYER.height);
    // canvasContext.drawImage(PLAYER.imgSrc, 0, 0, PLAYER.width, PLAYER.height);
}

function drawPaddle() {
    for(let i = 0; i < paddles.length; i++) {
        let paddle = paddles[i]
        canvasContext.fillStyle = paddle.color;
        canvasContext.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
}

function drawEnemy() {
    for(let i = 0; i < paddles.length; i++) {
        let paddle = paddles[i];

        if(paddle.hasEnemy) {
            let e = new Enemy(paddle.x + paddle.width / 2, paddle.y - PLAYER.height);
            if(e.isAlive) {
                canvasContext.fillStyle = e.color;
                canvasContext.fillRect(e.x, e.y, e.width, e.height);
                updateEnemy(e.x, e.y, e.width, e.height);

                if(PLAYER.moveType === 'punch' && (PLAYER.x + PLAYER.width + PLAYER.attackRange >= e.x || PLAYER.x - PLAYER.attackRange >= e.x + e.width) && PLAYER.y === e.y) {
                    e.hp--;
                    console.log(e.hp);
                    if(e.hp <= 0 && Math.floor(Math.random() * 5) === 0) {
                        paddle.hasEnemy = false;
                        e.isAlive = false;
                        PLAYER.score += 100;
                        PLAYER.moveType = 'none';
                    }
                    else {
                        console.log('Промах!');
                        PLAYER.moveType = 'none';
                    }
                }
            }
        }
    }
}

function updateEnemy(x, y, width, height) {
    if (
        ((PLAYER.x >= x && x + width >= PLAYER.x) || (PLAYER.x + PLAYER.width >= x && x + width >= PLAYER.x))
        && (PLAYER.y === y || (PLAYER.y + PLAYER.height >= y && PLAYER.y + PLAYER.height <= y + height))
    ) {
        GAME.isOver = true;
    }
}

function drawScore() {
    canvasContext.fillStyle = 'white';
    canvasContext.font = '32px Poppins';
    canvasContext.fillText(PLAYER.score, 20, 50);
}

function drawAnimation() {
    if(PLAYER_MOVE.imgIsLoad) {
        canvasContext.drawImage(PLAYER_MOVE, PLAYER.x, PLAYER.y);
    }
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawPlayer();
    drawPaddle();
    drawEnemy();
    drawScore();
}

function updatePlayer(paddle, x, y, width, height) {
    /*FIXME: Починить коллизию с правым краем платформы!*/

    // Проверка коллизии с платформой (наступил сверху)
    if ((PLAYER.y + PLAYER.height > y && PLAYER.y <= y) && (x <= PLAYER.x && PLAYER.x <= x + width) && (PLAYER.x <= x + width)) {
        PLAYER.y = y - 2 * height;
        PLAYER.isInAir = false;
        PLAYER.canJump = true;
        if(PLAYER.moveType === 'down') {
            PLAYER.moveType = 'none';
        }
    }

    // Проверка коллизии с левым краем платформы
    if (((PLAYER.x + PLAYER.width >= x) && (PLAYER.x + PLAYER.width < x + width / 2)) && (y <= PLAYER.y + PLAYER.height - 1) && (y + height > PLAYER.y)) {
        PLAYER.x = x - PLAYER.width;
        PLAYER.canJump = true;
    }

    //  // Проверка коллизии с правым краем платформы
    if (((PLAYER.x <= x + width) && (PLAYER.x > x + width / 2)) && (y <= PLAYER.y + PLAYER.height - 1) && (y + height > PLAYER.y)) {
        PLAYER.x = x + width;
    }

    // Проверка коллизии с нижним краем платформы
    if(PLAYER.y <= y+height && PLAYER.y > y && (x <= PLAYER.x && PLAYER.x <= x + width) && (PLAYER.x <= x + width)) {
        PLAYER.y = y+height;
    }

    // Игрок в воздухе или нет?
    if(PLAYER.y < y || PLAYER.y > y) {
        PLAYER.isInAir = true;
    }


    // Если игрок за границами экрана:
    if(PLAYER.y > GAME.height || PLAYER.x + PLAYER.width < 0) {
        GAME.isOver = true;
    }
}

function play() {
    if(GAME.isOver) {
        return;
    }
    for(let i = 0; i < paddles.length; i++) {
        updatePlayer(paddles[i], paddles[i].x, paddles[i].y, paddles[i].width, paddles[i].height)
        drawFrame();
        paddles[i].move();

        if(paddles[i].x + paddles[i].width < 0) {
            paddles[i].x = GAME.width;
            paddles[i].y = getRandomHeight();
            paddles[i].hasEnemy = generateEnemy();
        }

    }
    physics();
    if (PLAYER.moveType === 'jump') {
        if (PLAYER.jump_pos !== PLAYER.jumpLength) {
            PLAYER.canJump = false
            PLAYER.y -= 25;
            PLAYER.jump_pos += 25;
            PLAYER.score++;
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
        PLAYER.score++;
    }
    if(PLAYER.moveType === 'down') {
        PLAYER.y += PLAYER.fallSpeed*7;
        PLAYER.score++;
    }

    requestAnimationFrame(play)
}