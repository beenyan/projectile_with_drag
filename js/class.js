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
            max: { y: 0, x: 0, degree: 45 },
            pastTime: 0, // 經過時間
            data: [], // 資料
            pathData: [], // 要繪製的路徑
            angleWithDistance: [] // 角度與時間關係
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
        this.max.degree = atan(this.v.val / sqrt(pow(this.v.val, 2) + 2 * G * this.y));
        $('#no-air-degree').val(this.max.degree);
        this.init();
    }
    init() {
        // 飛行時間
        this.overTime = this.projectTime(); // 結束時間
        this.dTime = min(this.overTime / 500, 0.001); // 時間間隔
        this.pos.x = this.x;
        this.pos.y = this.y;
        if (!this.isDrag) calculateDegree();
    }
    start() {
        this.setValue();
        this.isUpdate = true;
        this.data = [this.position];
        this.pathData = [this.position];
        while (this.pos.y >= 0) {
            this.pastTime += this.dTime;
            let newPos = this.move();
            this.pos.x += newPos.x;
            this.pos.y += newPos.y;
            this.data.push(this.position);
        }
        this.pos.x = this.x;
        this.pos.y = this.y;
        this.pathGrid = floor(this.data.length / 200); // 取點數量
        this.pathIndex = 0;
    }
    projectTime(vy = this.v.y) {
        let a = -G;
        let b = 2 * vy;
        let c = 2 * this.y;
        let bb4ac = sqrt(pow(b, 2) - 4 * a * c);
        let t = max((-b + bb4ac) / (2 * a), (-b - bb4ac) / (2 * a));
        return t;
    }
    distanceWithAir(degree, dTime = this.dTime) {
        let x = 0;
        let y = this.y;
        let vx = parseFloat((cos(degree) * this.v.val).toFixed(14));
        let vy = parseFloat((sin(degree) * this.v.val).toFixed(14));
        while (1) { // 計算投擲距離
            let cx = -vx * (this.v.drag / this.m);
            let cy = -vy * (this.v.drag / this.m) - G;
            vx = vx + cx * dTime;
            vy = vy + cy * dTime;
            let dx = (vx * dTime);
            let dy = (vy * dTime) - (0.5 * G * pow(dTime, 2));

            if (y + dy < 0) {
                let ny = y + dy;
                let yPercent = ny / vy;
                x -= vx * yPercent;
                break;
            }
            x += dx;
            y += dy;
        }
        return x;
    }
    distance(degree) {
        let distance = 0;
        if (this.isDrag) { // 有空氣阻力
            distance = this.distanceWithAir(degree);
        } else {
            let vx = cos(degree) * this.v.val;
            let vy = sin(degree) * this.v.val;
            distance = this.projectTime(vy) * vx;
        }
        this.angleWithDistance.push(distance);
    }
    drawDistance() {
        stroke(this.pathColor);
        strokeWeight(2);
        beginShape();
        noFill();
        this.angleWithDistance.forEach((point, index) => vertex(xGrid * index / 10, -point * scale));
        endShape();
    }
    get C_Drag() {
        return {
            x: -(this.isDrag ? (this.v.drag / this.m) * this.v.x : 0),
            y: -(this.isDrag ? (this.v.drag / this.m) * this.v.y : 0) - G
        };
    }
    get position() {
        return { time: this.pastTime, vx: this.v.x, vy: this.v.y, ...this.pos };
    }
    get csv() {
        let data = this.data.map(item => Object.values(item)).join('\n');
        return data;
    }
    get csv_parameter() {
        return `高度,${this.y}
            初速度,${this.v.val}
            角度,${this.degree}
            空氣阻力,${this.v.drag}
            質量,${this.m}
            最遠所需角度,${this.max.degree}\n`.replaceAll(' ', '');
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
        this.pathData.forEach(point => vertex(point.x * scale, -point.y * scale));
        endShape();
    }
    draw() {
        this.update();
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
    move() { // 移動到的位置
        let c = this.C_Drag;

        this.v.x = this.v.x + c.x * this.dTime;
        this.v.y = this.v.y + c.y * this.dTime;
        return {
            x: (this.v.x * this.dTime) - (0.5 * 0 * pow(this.dTime, 2)),
            y: (this.v.y * this.dTime) - (0.5 * G * pow(this.dTime, 2))
        };
    }
    update() {
        if (!this.isUpdate || this.pos.y < 0) return;
        this.pathIndex += this.pathGrid;
        if (this.pathIndex >= this.data.length) { // 最後一個
            this.pos.y = this.data[this.data.length - 1].y;
            this.pos.x = this.data[this.data.length - 1].x;
            this.pathData.push(this.data[this.data.length - 1]);
            return;
        }
        this.pathData.push(this.data[this.pathIndex]);
        this.pos.y = this.data[this.pathIndex].y;
        this.pos.x = this.data[this.pathIndex].x;
    }
}

class DOD { // degree of distance
    constructor(degree) {
        this.degree = degree;
        this.distance = getAirDistance(degree, 0.000001);
    }
}