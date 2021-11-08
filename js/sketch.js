function setup() {
    angleMode(DEGREES); // 輸入角度
    setBoundary();
    createCanvas(size.w, size.h);
    init();
}

function update() {
    balls.forEach(ball => ball.update());
}

function draw() {
    background('#0D1117');
    axis();
    balls.forEach(ball => ball.draw());
}

window.onload = () => {
    setInterval(update, 1);
};

let size;
const G = 9.8;
let base = 50;
let scale = 2;
let boundary;
let dragBall = new Ball({ drag: true, pathColor: '#AB5E9D' });
let noDragBall = new Ball();
let balls = [dragBall, noDragBall];