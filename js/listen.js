$('#parameter-button,#control-button').click(item => {
    let $self = $(item.target);
    let $container = $self.parent();
    let show = $container.attr('show') === 'false';  // toggle boolen
    $container.attr('show', show); // 打開、關閉 輸入框
});

// 更新輸入的值
$('#height,#velocity,#degree,#drag,#mass').on('input', event => { // 設定輸入值
    let self = event.target;
    let regex = new RegExp(self.getAttribute('pattern'));
    // 數值輸入錯誤跳出
    if (!self.value.match(regex)) return;
    let type = self.getAttribute('type');
    // 動態更新顯示數字
    if (type === 'range')
        $(self).parent().find('.value').text(parseFloat(self.value));
    setValue();
});

// 更改畫布繪製
$('input:radio[name=draw]').change(event => {
    let self = event.target;
    interface = self.value;
    if (self.value === 'degreeWithDistence') // 計算角度
        calculateDegree();
})

// 改動角度
$('.set-value').click(event => {
    let self = event.target;
    let degree = $(self).find(':text').val();
    if (isNaN(parseFloat(degree))) return;
    $('#degree').val(degree);
    $('#degree').parent().find('.value').text(degree);
    setValue();
})

// 開始演算路徑
$('#start').click(() => balls.forEach(ball => ball.start()));