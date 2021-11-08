class Ball {
    constructor(args) {
        let def = {
            x: 0,
            y: 100,
            m: 10, // 質量
            speed: 5, // 速度
            diameter: 20, // 半徑
            degree: 45, // 角度
            drag: false, // 是否受到風阻影響
            second: 2, // 跑完程式需要的時間
            startTime: +new Date(), // 開始時間
            pathColor: 'yellow',
            run: { drawArrow: true, update: false },
            pos: { x: 0, y: 0 },
            v: { val: 60, x: 0, y: 0, drag: 0.9 }, // 速度變化量
            data: [] // 路徑資料
        }
        Object.assign(def, args);
        Object.assign(this, def);
    }
    get position() {
        let timeLeft = (+new Date() - this.startTime) / 1000 * this.speed;
        let drag = this.dragV(timeLeft);
        return {
            x: this.v.x * timeLeft + (this.drag ? drag.x : 0),
            y: this.y - (this.v.y * timeLeft + this.gravity(timeLeft)) + (this.drag ? drag.y : 0)
        }
    }
    dragV(timeLeft) {
        return {
            x: -(this.v.drag / this.m) * this.v.x * timeLeft,
            y: (this.v.drag / this.m) * this.v.y * timeLeft
        }
    }
    gravity(time) {
        return 0.5 * G * time ** 2;
    }
    init() {
        this.v.x = cos(this.degree) * parseFloat(this.v.val);
        this.v.y = -sin(this.degree) * parseFloat(this.v.val);
        this.run.update = false;
        this.run.drawArrow = true;
        // 座標軸校正
        let yMax = pow(this.v.y, 2) / (2 * G) + this.y;
        let xMax = (this.v.x * this.v.y / -G) + (sqrt(2 * yMax / G) * this.v.x);
        let t = (-this.v.y / G) + (sqrt(2 * yMax / G));
        scale = min(abs(size.w / (1.2 * xMax)), abs(size.h / (1.2 * yMax)));
        this.speed = t / this.second; // 速度校正

        this.pos.x = this.x;
        this.pos.y = -this.y * scale;
    }
    arrow() {
        let startLen = 25;
        let endLen = 55;
        let v0 = createVector(this.pos.x + startLen * cos(this.degree), this.pos.y - startLen * sin(this.degree));
        let v1 = createVector(endLen * cos(this.degree), -endLen * sin(this.degree));
        drawArrow(v0, v1, 'blue');
    }
    drawPath() { // 繪製路線
        stroke(this.pathColor);
        strokeWeight(2);
        beginShape();
        noFill();
        this.data.forEach(point => vertex(point.x * scale, -point.y * scale));
        endShape();
    }
    draw() {
        push();
        translate(boundary, size.h - boundary);
        if (this.run.drawArrow) // 畫角度箭頭
            this.arrow();
        this.drawPath();
        noStroke();
        fill('white');
        circle(this.pos.x, this.pos.y, this.diameter);
        pop();
    }
    update() {
        if (this.pos.y > 0) return;
        if (!this.run.update) return;
        let pos = this.position;
        this.pos.x = scale * pos.x;
        this.pos.y = scale * -pos.y;
        this.data.push(this.position);
    }
}