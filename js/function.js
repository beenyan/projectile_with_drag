let setValue = () => balls.forEach(ball => ball.setValue());

let setBoundary = () => { // 設定座標偏移
    size = { w: windowWidth * 0.9, h: windowHeight * 0.95 };
    let temp = min(size.w, size.h);
    boundary = temp * 6 / 100;
    xGrid = (size.w - boundary - 50) / 9;
}

let axis = () => {
    push();
    translate(boundary, size.h - boundary);

    let boardCount = size.w / (base * scale);
    if (boardCount > 12) {
        base *= 2;
        boardCount /= 2;
    } else if (boardCount < 6) {
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

let degreeAxis = () => {
    let boardCount = size.w / (base * scale);
    if (boardCount > 12) {
        base *= 2;
        boardCount /= 2;
    } else if (boardCount < 6) {
        base /= 2;
        boardCount *= 2;
    }

    // 10 公尺軸
    stroke('rgb(80,0,0)');
    strokeWeight(1);
    for (let bx = 0; bx < size.w; bx += xGrid / 5)
        line(bx, 0, bx, -size.h);
    for (let by = 0; by < size.h; by += base / 5 * scale)
        line(0, -by, size.w, -by);

    // 50 公尺軸
    textSize(16);
    strokeWeight(3);
    fill('#F27477');
    textAlign(CENTER);
    for (let bx = 10; bx <= 90; bx += 10) {
        let posx = bx * xGrid / 10;
        stroke('rgb(160,0,0)');
        line(posx, 0, posx, -size.h);
        noStroke();
        text(bx + '°', posx, 16);
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
    textSize(16);
    fill('#F27477');
    stroke('red');
    strokeWeight(5);
    line(0, boundary, 0, -size.h);
    line(-boundary, 0, size.w, 0);
    noStroke();
    text(0, -15, 15);
}

let drawArrow = (base, vec, color) => {
    let arrowSize = 7;
    push();
    stroke(color);
    strokeWeight(3);
    fill(color);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}

let createCsvFile = () => {
    let fileName = "拋體運動.csv"; // 匯出的檔名
    let data = getData();
    // "\ufeff" 解決亂碼問題
    let blob = new Blob(["\ufeff" + data], { type: "application/octet-stream" });
    let href = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    link.click();
}

let getData = () => { // 資料生成
    let parameter = balls[0].csv_parameter;
    let header = "時間,速度（x）,速度（y）,位置（x）,位置（y）\n";
    let data = `無空氣阻力\n${balls[1].csv}\n\n有空氣阻力\n${balls[0].csv}`;
    return parameter + header + data;
}

let getAirDistance = degree => {
    return balls[0].distanceWithAir(degree);
}

let calculateDegree = () => {
    balls.forEach(ball => ball.angleWithDistance = []);
    for (let degree = 0; degree <= 90; ++degree)
        balls.forEach(async ball => ball.distance(degree));
    let maxIndex = 0;
    let max = 0;
    balls[0].angleWithDistance.forEach((distance, index) => {
        if (distance >= max) {
            max = distance;
            maxIndex = index;
        }
    })
    $('#has-air-degree').val(maxIndex);
    for (let i = 0; i < 4; ++i) // 精算四次
        calculateDegreePrecision();
}

let calculateDegreePrecision = () => {
    let degree = $('#has-air-degree').val();
    if (isNaN(parseFloat(degree))) return;
    let floatLen = degree.toString().split('.')[1]?.length;
    degree = parseFloat(degree); // 轉成數字
    if (floatLen === undefined) floatLen = 0;
    ++floatLen;
    let step = 1 / pow(10, floatLen);
    let defaultDistance = getAirDistance(degree);
    if (defaultDistance > getAirDistance((degree + step).toFixed(floatLen)))  // 更高值在左邊
        step *= -1;
    for (let i = 1; i < 10; ++i) {
        let nowDistance = getAirDistance((degree + step * i).toFixed(floatLen));
        if (defaultDistance > nowDistance) {
            $('#has-air-degree').val((degree + step * --i).toFixed(floatLen));
            return; // 數值變小
        }
        defaultDistance = nowDistance;
    }

}