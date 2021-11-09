class Ball {
    constructor(args) {
        let def = {
            x: 0,
            y: 0,
            m: 0, // 質量
            degree: 0, // 角度
            diameter: 20, // 半徑
            second: 2, // 跑完程式需要的時間
            IsDrag: false, // 是否受到風阻影響
            startTime: 0, // 開始時間
            pathColor: 'yellow', // 路徑顏色
            isUpdate: false,
            pos: { x: 0, y: 0 },
            v: { val: 0, x: 0, y: 0, drag: 0 }, // 速度變化量
            max: { y: 0, x: 0 },
            data: [] // 路徑資料
        }
        Object.assign(def, args);
        Object.assign(this, def);
    }
    setValue() {
        this.isUpdate = false;
        this.y = parseFloat($('#height').val());
        this.v.val = parseFloat($('#velocity').val());
        this.degree = parseFloat($('#degree').val());
        this.v.drag = parseFloat($('#drag').val());
        this.m = parseFloat($('#mass').val());
        this.v.x = cos(this.degree) * this.v.val;
        this.v.y = sin(this.degree) * this.v.val;
        this.init();
    }
    get C_Drag() {
        return {
            x: -(this.isDrag ? (this.v.drag / this.m) * this.v.x : 0),
            y: -(this.isDrag ? (this.v.drag / this.m) * this.v.y : 0)
        };
    }
    init() {
        // 飛行時間
        let g = this.gravity;
        let a = -G;
        let b = 2 * this.v.y;
        let c = 2 * this.y;
        let bb4ac = sqrt(pow(b, 2) - 4 * a * c);
        let t = max((-b + bb4ac) / (2 * a), (-b - bb4ac) / (2 * a));
        this.speed = t / this.second; // 速度校正

        this.pos.x = this.x;
        this.pos.y = this.y;
    }
    start() {
        this.setValue();
        this.isUpdate = true;
        this.startTime = +new Date();
        this.data = [this.position(0)];
    }
    position(time) {
        return { time, ...this.pos, v: { ...this.v } };
    }
    arrow() {
        let startLen = 25;
        let endLen = 55;
        let v0 = createVector(this.pos.x * scale + startLen * cos(this.degree), -this.pos.y * scale - startLen * sin(this.degree));
        let v1 = createVector(endLen * cos(this.degree), -endLen * sin(this.degree));
        drawArrow(v0, v1, 'blue');
    }
    path() { // 繪製路徑
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
        if (!this.isUpdate) // 畫角度箭頭
            this.arrow();
        this.path();
        fill('white');
        stroke('black');
        circle(this.pos.x * scale, -this.pos.y * scale, this.diameter);
        pop();
    }
    move(time) { // 移動到的位置
        let c = this.C_Drag;
        return {
            x: (this.x) + (this.v.x * time) - (0.5 * 0 * pow(time, 2)),
            y: (this.y) + (this.v.y * time) - (0.5 * G * pow(time, 2))
        };
    }
    update() {
        if (!this.isUpdate) return;
        if (this.pos.y < 0) return;
        let time = (+new Date() - this.startTime) / 1000;
        let newPos = this.move(time * this.speed);
        this.pos.x = abs(newPos.x);
        this.pos.y = newPos.y;
        this.data.push(this.position(time));
    }
}