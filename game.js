const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const audio = new Audio('sounds/currdkk.m4a');
const fail = new Audio('sounds/hit-pipe.mp3');
let PIPE_VELOCITY = 20;
let gameOver = false;
const shiftAmount = 90
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const pipeVar = 0.3;
const gravity = 1.96;
let ct = 0;
const colors =  ['purple', 'white', 'blue', 'pink']
const pipeGap = (canvas.height * (0.29));

c.fillRect(0, 0, canvas.width, canvas.height);

const pipeWidth = (canvas.width * pipeVar) * (.95);
const pipeHeight = (canvas.height * 0.42) * (1.5);

function getRandomColor() {
    let randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

class Player {
    constructor(position, velocity, width, height, color) {
        this.position = position;
        this.height = height;
        this.width = width;
        this.velocity = velocity;
        this.color = color;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    updatePlayer() {
        this.draw();
        this.position.y += this.velocity.y;

        if (this.position.y >= canvas.height - this.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    checkCollision(pipe) {
        if (
            this.position.x < pipe.position.x + pipe.width &&
            this.position.x + this.width > pipe.position.x &&
            this.position.y < pipe.position.y + pipe.height &&
            this.position.y + this.height > pipe.position.y
        ) {
            fail.play()
            pipeBottom.velocity.x = 0, pipeTop.velocity.x = 0
            pipeBottom2.velocity.x = 0, pipeTop2.velocity.x = 0
            gameOver = true
            setTimeout(() => {
                this.velocity.y = 25
                this.velocity.x = 50
            }, 200)
        }
    }
}

class Pipe {
    constructor(position, velocity, height, width, color) {
        this.position = position;
        this.height = height;
        this.width = width;
        this.velocity = velocity;
        this.color = color;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    updatePipe() {
        this.checkCollision(player);
        this.draw();

        if (this.position.x + this.width <= 0) {
            if (typeof this.counter === "undefined") {
                this.color = getRandomColor()
                this.counter = 0;
            }
            let num = this.counter % 2 === 0 ? 90 : -90;
            this.counter++;
            this.position.x = canvas.width;
            playSoundPipe()
            this.position.y += num;

            ct += 0.5;
        }

        this.position.x -= this.velocity.x;
    }


    checkCollision(player) {
        player.checkCollision(this);
    }
}

const player = new Player(
    (position = {
        x: canvas.width * 0.039 + 10,
        y: canvas.height * 0.139,
    }),
    (velocity = {
        x: 0,
        y: 10,
    }),
    90,
    90 ,
    getRandomColor()
);

const pipeBottom = new Pipe(
    {
        x: canvas.width + pipeWidth,
        y: canvas.height * 0.556 - shiftAmount, // Adjust the y position by subtracting the shift amount
    },
    {
        x: PIPE_VELOCITY,
        y: 0,
    },
    pipeHeight,
    pipeWidth,
    getRandomColor()
);

const pipeTop = new Pipe(
    {
        x: canvas.width + pipeWidth,
        y: -pipeHeight + pipeGap - shiftAmount, // Adjust the y position by subtracting the shift amount
    },
    {
        x: PIPE_VELOCITY,
        y: 0,
    },
    pipeHeight,
    pipeWidth,
    getRandomColor()
);


const pipeBottom2 = new Pipe(
    {
        x: (canvas.width + canvas.width * pipeVar) / 2,
        y: canvas.height * 0.556 - shiftAmount + 130, // Adjust the y position by subtracting the shift amount
    },
    {
        x: PIPE_VELOCITY,
        y: 0,
    },
    pipeHeight,
    pipeWidth,
    getRandomColor()
);

const pipeTop2 = new Pipe(
    {
        x: (canvas.width + canvas.width * pipeVar) / 2,
        y: -pipeHeight + pipeGap - shiftAmount + 130, // Adjust the y position by subtracting the shift amount
    },
    {
        x: PIPE_VELOCITY,
        y: 0,
    },
    pipeHeight,
    pipeWidth,
getRandomColor());


animate()

function animate() {
    make_base();
    c.font = "60px ArcadeClassic"
    pipeBottom.updatePipe()
    pipeTop.updatePipe()
    pipeTop2.updatePipe()
    pipeBottom2.updatePipe()
    player.updatePlayer()
    c.fillStyle = 'white'
    c.fillText(ct, canvas.width * .45, 125)
    window.requestAnimationFrame(animate)
}

function keyPressHandler(e) {
    if (e.code === 'Space') {
        player.velocity.y = 38;
        player.position.y -= 30;
        player.velocity.y -= 52;
        playSoundMove();
    }
}

document.addEventListener("keypress", keyPressHandler);

function removeKeyPressHandler() {
    document.removeEventListener("keypress", keyPressHandler);
}

if (gameOver) {
    removeKeyPressHandler();
}


function playSoundMove() {
    const jumpSound = new Audio('sounds/through-pipe.mp3');
    jumpSound.load();
    jumpSound.play();
}
function playSoundPipe() {
    const jumpSound = new Audio('sounds/point.mp3');
    jumpSound.load();
    jumpSound.play();
}
audio.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play();
});
audio.load()
audio.play();


function make_base() {
    base_image = new Image();
    base_image.src = 'imgs/background.jpg';
    base_image.onload = function () {
        c.drawImage(base_image, 0, 0);
    }
}
