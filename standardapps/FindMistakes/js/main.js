(function() {
    'use strict';
    {
        const canvas = document.getElementById('stage');
        if (typeof canvas.getContext === 'undefined') {
            return;
        }
        const ctx = canvas.getContext('2d');
        const height = canvas.height;
        const width = canvas.width;
        const timer = document.getElementById('count');
        const replay = document.getElementById('replay');
        const score = document.getElementById('score');
        replay.style.visibility = 'hidden';
        replay.style.textDecoration = 'none';
        replay.style.background = '#c0c0c0';
        replay.style.color = '#000';
        replay.style.padding = '5px';
        replay.style.borderRadius = '5px';


        let count = 0;
        let dim,size,answer,offset,elpsdTm,timeoutId;
        let playing = true;
        let onceStart = false;

        function initialize() {
            try {
                // ブロック分割数
                dim = Math.floor(count / 4) + 2;
                // 正解パネルをランダムで生成
                answer = [
                    Math.floor(Math.random() * dim),
                    Math.floor(Math.random() * dim),
                ];        
                // 余白
                offset = 4;
                // 1ブロックのサイズ
                size = Math.floor(height / dim);
                // 描画前に画面をクリア
                ctx.clearRect(0, 0, width, height);
            } catch (e) {
                console.log(e.message);
            }
        }

        function draw() {
            try {
                let x,y
                // 変数各種
                let hue,lightness,baseColor,answerColor;
                
                // 初期化処理
                initialize();
                // ブロックをランダムな色にする
                hue = Math.random() * 360;
                // 正解数の分、明度を少しずつ下げる
                lightness = Math.max(75 - count, 53);
                // 不正解ブロックをhsl(色相、彩度、明度)で色指定
                baseColor = `hsl(${hue}, 80%, 50%)`;
                // 正解ブロック
                answerColor = `hsl(${hue}, 80%, ${lightness}%)`;
                
                // ブロックを描画
                for (x = 0; x < dim; x++) {
                    for (y = 0; y < dim; y++) {
                        // 正解のブロック
                        if (answer[0] === x && answer[1] === y) {
                            ctx.fillStyle = answerColor;
                        // 不正解のブロック
                        } else {
                            ctx.fillStyle = baseColor;
                        }
                        ctx.fillRect(
                            size * x,
                            size * y,
                            size - offset,
                            size - offset
                        );
                    }
                }
            } catch (e) {
                console.log(e.message);
            }
        }
        draw();

        // タイマーカウント
        function cnt() {
            console.log(((Date.now() - elpsdTm) / 1000).toFixed(2));
            timer.innerHTML = `elapsedtime:${((Date.now() - elpsdTm) / 1000).toFixed(2)}`;
            timeoutId = setTimeout(() => {
                cnt();
            }, 10);
        }
        /** ブロッククリック時の挙動*/
        canvas.addEventListener('click', e => {   
            try {
                if (!playing) {
                    return;
                }
                // 変数各種
                let rect,clkdX,clkdY,blkNumX,blkNumY;
                // canvas領域の座標を取得
                rect = e.target.getBoundingClientRect();
             
                /** タイマースタート*/
                if (!onceStart) {
                    elpsdTm = Date.now();
                    console.log(elpsdTm);            
                    cnt();
                }
                
                /** X座標の左端を0に初期化し、始点を変数で定義 */ 
                // e.pageX=ページ内のX座標　rect.left=canvas領域の左端座標
                clkdX = e.pageX - rect.left - scrollX;
                // e.pageY=ページ内のY座標　rect.top=canvas領域の上端座標
                clkdY = e.pageY - rect.top - 0.1875 - scrollY;
                // クリックされたブロックの位置を取得
                blkNumX = Math.floor(clkdX / size);
                blkNumY = Math.floor(clkdY / size);
    
                onceStart = true;
                // 正解の場合
                if (answer[0] === blkNumX && answer[1] === blkNumY) {
                    console.log('correct');
                    count++;   
                    score.innerHTML = `score:${count}`;
                    draw();        
                // 不正解の場合   
                } else {     
                    clearTimeout(timeoutId);   
                    alert(`Wrong!\nYour score is ${count}`);
                    let ans = confirm(`Replay?`);
                    if (ans) {
                        window.location.reload();
                    } else {
                        playing = false;
                        replay.style.visibility = 'visible';    
                    }
                }     
            } catch (e) {
                console.log(e.message);
            }     
        });
    }

}) ();