let setBoundary = (percent = 6) => {
    size = { w: windowWidth * 0.9, h: windowHeight * 0.95 };
    let temp = min(size.w, size.h);
    boundary = temp * percent / 100;
}

let init = () => {
    balls.forEach(ball => ball.init());
}

let axis = () => {
    push();
    translate(boundary, size.h - boundary);

    let boardCount = size.w / (base * scale);
    while (boardCount > 12) {
        base *= 2;
        boardCount /= 2;
    }

    while (boardCount < 7) {
        base /= 2;
        boardCount *= 2;
    }
    // 10 公尺軸
    stroke('rgb(80,0,0)');
    strokeWeight(1);
    for (let bx = 0; bx < size.w; bx += base / 5 * scale)
        line(bx, 0, bx, -size.h);
    for (let by = 0; by < size.h; by += base / 5 * scale)
        line(0, -by, size.w, -by);

    // 50 公尺軸
    textSize(16);
    strokeWeight(3);
    fill('#F27477');
    textAlign(CENTER);
    for (let bx = base * scale; bx < size.w; bx += base * scale) {
        stroke('rgb(160,0,0)');
        line(bx, 0, bx, -size.h);
        noStroke();
        text(round(bx / scale, 3), bx, 16);
    }
    textAlign(RIGHT, CENTER);
    for (let by = base * scale; by < size.h; by += base * scale) {
        stroke('rgb(160,0,0)');
        line(0, -by, size.w, -by);
        noStroke();
        text(round(by / scale, 3), -5, -by);
    }

    // x y 軸
    textAlign(CENTER, CENTER);
    stroke('red');
    strokeWeight(5);
    line(0, boundary, 0, -size.h);
    line(-boundary, 0, size.w, 0);
    noStroke();
    text(0, -15, 15);
    pop();
}

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}