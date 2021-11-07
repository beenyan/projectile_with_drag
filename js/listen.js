$parameter = $('#parameter');

$('#parameter-button').click(() => {
    // toggle boolen
    $parameter.attr('show', $parameter.attr('show') === 'false');
});

$('#height').on('input', event => { // 設定高度
    let self = event.target;
    if (!self.value.match(/^[+]?\d+(\.\d+)?$/)) return;
    balls.forEach(ball => ball.y = parseFloat(self.value));
    init();
});

$('#velocity').on('input', event => { // 設定初速度
    let self = event.target;
    if (!self.value.match(/^[+]?\d+(\.\d+)?$/)) return;
    balls.forEach(ball => ball.v.val = parseFloat(self.value));
});

$('#degree').on('input', event => { // 設定角度
    let self = event.target;
    if (!self.value.match(/^[-+]?\d+(\.\d+)?$/)) return;
    balls.forEach(ball => ball.degree = parseFloat(self.value));
    $(self).parent().find('.value').text(parseFloat(self.value));
    init();
});

$('#drag').on('input', event => { // 設定空氣阻力
    let self = event.target;
    if (!self.value.match(/^[+]?\d+(\.\d+)?$/)) return;
    dragBall.v.drag = parseFloat(self.value);
    $(self).parent().find('.value').text(parseFloat(self.value));
    init();
});

$('#mass').on('input', event => { // 設定重量
    let self = event.target;
    if (!self.value.match(/^[+]?\d+(\.\d+)?$/)) return;
    dragBall.m = parseFloat(self.value);
    $(self).parent().find('.value').text(parseFloat(self.value));
    init();
});


$('#start').click(() => {
    init();
    balls.forEach(ball => {
        ball.run.update = true;
        ball.startTime = +new Date();
        ball.run.drawArrow = false;
        ball.data = [ball.position];
    });
});