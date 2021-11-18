$('#parameter-button,#dataLog-button').click(item => {
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

// 開始演算路徑
$('#start').click(() => balls.forEach(ball => ball.start()));