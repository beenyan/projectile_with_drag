let setBoundary = (percent = 5) => {
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
    // 10 公尺軸
    stroke('rgb(80,0,0)');
    strokeWeight(1);
    for (let bx = 0; bx < size.w; bx += 10 * scale)
        line(bx, 0, bx, -size.h);
    for (let by = 0; by < size.h; by += 10 * scale)
        line(0, -by, size.w, -by);

    // 50 公尺軸
    textSize(16);
    strokeWeight(3);
    fill('#F27477');
    textAlign(CENTER);
    for (let bx = 50 * scale; bx < size.w; bx += 50 * scale) {
        stroke('rgb(160,0,0)');
        line(bx, 0, bx, -size.h);
        noStroke();
        text(bx / scale, bx, 16);
    }
    textAlign(RIGHT, CENTER);
    for (let by = 50 * scale; by < size.h; by += 50 * scale) {
        stroke('rgb(160,0,0)');
        line(0, -by, size.w, -by);
        noStroke();
        text(by / scale, -5, -by);
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