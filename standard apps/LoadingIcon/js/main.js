(function()  {
    'use strict';

    // canvas領域の取得
    let stage = document.getElementById('stage');
    // canvasの縦横幅を取得
    let width = stage.width;
    let height = stage.height;
    // 回転角度
    let angle = 0;

    // canvas取得可否の確認
    if (typeof stage.getContext === 'undefined') {
        return;
    }
    // canvasオブジェクト取得
    let ctx = stage.getContext('2d');

    // canvas領域確認用塗りつぶし
    // ctx.translate(0,0);
    // ctx.fillStyle = '#c0c0c0';
    // ctx.fillRect(0,0,width,height);

    // 一定時間ごとに回転する処理
    function update() {
        // 半透明の背景で塗りつぶして軌跡を残す
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, width, height);
        draw();
        angle += 10;
        setTimeout(() => {
            update();
        }, 80);
    }
    update();

    // 描画
    function draw() {
        let r0 = 0;
        let r1 = 120;
        // 描画状態を保存
        ctx.save();
        // 描画開始座標をcanvasの中心に移動
        ctx.translate(width/2, height/2);
        // ctx.rotate(angle/180 * Math.PI);

        // 線のスタイル
        // ctx.strokeStyle = '#000000';
        // ctx.lineWidth = 3;
        // x軸
        // ctx.beginPath();
        // ctx.moveTo(-1000, 0);
        // ctx.lineTo(1000, 0);
        // ctx.stroke();
        // Y軸
        // ctx.beginPath();
        // ctx.moveTo(0, -1000);
        // ctx.lineTo(0, 1000);
        // ctx.stroke();

        // オレンジ線を描画
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 6;
        ctx.beginPath();
        // ctx.moveTo(0, -r0);
        // ctx.lineTo(0, -r1);

        // 小さい円
        ctx.moveTo(
            // X軸座標
            r0 * Math.cos(angle/180 * Math.PI),
            // Y軸座標
            r0 * Math.sin(angle/180 * Math.PI)
        )
        ctx.lineTo(
            // X軸座標
            r1 * Math.cos(angle/180 * Math.PI),
            // Y軸座標
            r1 * Math.sin(angle/180 * Math.PI)            
        )
      
            // console.log(Math.cos(angle/180 * Math.PI));
        ctx.stroke();
        ctx.restore();
    }

}) ();