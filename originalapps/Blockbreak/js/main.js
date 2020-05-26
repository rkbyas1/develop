$(function() {
    /**********************
    jQuery&canvasでの実装
    **********************/

    /** canvas定義 */
    const canvas = document.getElementById('canvasarea');
    const height = canvas.clientHeight;
    const width = canvas.clientWidth;
    const ctx = canvas.getContext('2d');

    /** 変数定義*/ 
    let score = 0;
    let lives = 3;
    let level = 1;
    let paddleMove = 20;
    let isPlaying = 0;
    let remainingBlocks = 0;
    let timeoutId, newStage;
    let paddleWidth = 120;
    let virtualBlocks = [];
    let blockDefs = {
        cols: 3,
        rows: 2
    }

    /** 乱数生成用 */
    const RandomNumber = function() {
        this.generate = (max, min) => {
            return Math.floor(Math.random() * (max-min) + min);
        }
    }
    /** ラベル描画 */
    const commonLabel = function() {
        this.draw = (text, x, y, color) => {
            ctx.font = 'bold 16px "Century Gothic"';
            ctx.fillStyle = color;
            ctx.textAlign = 'right';
            ctx.fillText(text, x, y);
        }
    }
    /** パドル描画 */
    const paddleEntity = function(w, h) {
        this.w = w;
        this.h = h;
        this.x = width/2 - this.w/2;
        this.y = height - this.h;
        this.draw = ()=> {
            ctx.fillStyle = '#7f00ff';
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        this.move = ()=> {
            // canvas上のマウス座標を取得する
            $('body').mousemove(e => {
                this.x = e.clientX - canvas.offsetLeft - this.w/2;
            });
        }
    }
    /** ボール描画 */
    const ballEntity = function(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ballSpeed = {
            vx: rand.generate(8, 3),
            vy: rand.generate(9, 5)
        }
        this.draw = ()=> {
            ctx.beginPath();
            ctx.fillStyle = '#ff0000';
            ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
            ctx.fill();
        }
        // ボールスピードup
        this.move = ()=> {
            this.x += this.ballSpeed.vx;
            this.y += this.ballSpeed.vy;
        }
        // 衝突判定&方向反転
        this.paddleCollision = ()=> {
            // 上下
            if ((this.y + this.r > height - paddle.h) 
                && (this.x > paddle.x && this.x < paddle.x + paddle.w)
                || (this.y - this.r < 0)) {
                this.ballSpeed.vy *= -1;
            // 下に行ったら残り数減またはゲームオーバー
            } else if (this.y > height){
                lives--;
                if (lives < 1) {
                    confirm(`Game Over!\nYour score is ${score}`);
                    window.location.reload();
                } else {
                    ball = new ballEntity(rand.generate(480, 20), rand.generate(20, 10), 10);
                    this.draw();
                }
            }
            // 左右
            if ((this.x + this.r > width) || (this.x - this.r < 0)){
                this.ballSpeed.vx *= -1;
            }
        }
        // ブロック衝突時の処理
        this.blockCollision = ()=> {
            for (let i = 0; i < blockDefs.cols; i++) {
                for (let j = 0; j < blockDefs.rows; j++) {
                    if (virtualBlocks[i][j] == null) {
                        continue;
                    }
                    // 衝突ブロックを判定＆方向反転
                    if (((this.y + this.r - 45 < virtualBlocks[i][j][1]) && this.ballSpeed.vy < 0)
                        && (this.x >= virtualBlocks[i][j][0] && this.x <= virtualBlocks[i][j][0] + blocks.w)) {
                        virtualBlocks[i][j] = null;
                        this.ballSpeed.vy *= -1;
                        score++;
                        remainingBlocks--;
                        if (remainingBlocks == 0) {
                            newStage = true;
                        }
                    } 
                    // 全て消したら次レベルへ
                    if (remainingBlocks == 0 && newStage) {
                        $('#msg').removeClass('hidden');
                        setTimeout(() => {
                            $('#msg').addClass('hidden');
                        }, 500);
                        level++;
                        if (level < 4) {
                            blockDefs.cols++;
                        }
                        blockDefs.rows++;
                        blocks.createBlocks();
                        paddle = new paddleEntity(paddleWidth -= 15, 15);
                        newStage = false;
                    }
                }
            }
        }
    }
    
    /** ステージ描画更新は常時行う */ 
    const updateStage = function() {
        this.clearStage = ()=> {
            ctx.fillStyle = '#e0dede';
            ctx.fillRect(0, 0, width, height);
        }
        // クリア後に更新
        this.refreshStage = ()=> {
            this.clearStage();
            label.draw(`Score:${score}`, 85, 25, '#35f');
            label.draw(`Level:${level}`, 85, 50, '#35f');
            label.draw(`Lives:${lives}`, 480, 25, '#f09');
            label.draw(`Rest:${remainingBlocks}`, 480, 50, '#f09');
            paddle.draw();
            paddle.move();
            ball.draw();
            ball.move();
            ball.paddleCollision();
            ball.blockCollision();
            blocks.drawBlocks();
            timeoutId = setTimeout(() => {
                this.refreshStage();  
            }, paddleMove);
        }
    }
    /** ブロック*/
    const blocksEntity = function(x, y, w, h, d) {
        this.createBlocks = ()=> {
            // ブロック状態を表すarray定義
            virtualBlocks = new Array(blockDefs.cols);
            for (let i = 0; i < virtualBlocks.length; i++) {
                virtualBlocks[i] = new Array(blockDefs.rows).fill(null);
            }
            // 初期ブロック描画可否判定用に仮値を保持
            for (let i = 0; i < blockDefs.cols; i++) {
                for (let j = 0; j < blockDefs.rows; j++) {
                    virtualBlocks[i][j] = 1;
                    remainingBlocks++;
                }
            }
        }
        // virtualBlocksに基づきブロック描画
        this.drawBlocks = ()=> {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.d = d;
            for (let i = 0; i < blockDefs.cols; i++) {
                for (let j = 0; j < blockDefs.rows; j++) {
                    if (virtualBlocks[i][j] != null) {
                        // ボール衝突判定用にvirtualBlock配列に座標情報を保持
                        virtualBlocks[i][j] = [this.x, this.y];
                        ctx.fillStyle = '#14a5ff';
                        ctx.fillRect(this.x, this.y, this.w, this.h);
                        this.y += this.h + this.d;
                    } else {
                        continue;
                    }
                }
                // ブロック数（レベル）によりブロック描画位置を調整
                switch (level) {
                    case 1:
                        this.x += Math.floor(width / 3);
                        break;
                    case 2:
                        this.x += Math.floor(width / 4);
                        break;
                    case 3:
                        this.x += Math.floor(width / 5);
                        break;
                    default:
                        this.x += Math.floor(width / 5);
                }
                this.y = y;
            }           
        }
    }

    /** インスタンス宣言 */ 
    const rand = new RandomNumber();
    const label = new commonLabel();
    let paddle = new paddleEntity(paddleWidth, 15);  //パドル幅 パドル高さ
    const update = new updateStage();
    let ball = new ballEntity(rand.generate(480, 20), rand.generate(20, 10), 10); // 中心x 中心y 半径r
    const blocks = new blocksEntity(20, 65, 80, 20, 10); // 描画開始X 描画開始Y 横幅 縦幅 間隔 

    // 初期表示はメッセージを隠す
    $('#msg').addClass('hidden');
    
    /** ゲームスタート*/ 
    $('#button').click( ()=> {
        // リスタート時
        if (isPlaying == 1) {
            update.refreshStage();
            $('#button').removeClass('start');
            $('#button').addClass('pause');
            $('#button').text('PAUSE').fadeIn();
            isPlaying = 2;
        // ストップ時
        } else if (isPlaying == 2) {
            clearTimeout(timeoutId);
            $('#button').removeClass('pause');
            $('#button').addClass('start');
            $('#button').text('RESTART').fadeIn();
            isPlaying = 1;
        // 初回スタート時
        } else if (isPlaying == 0){
            blocks.createBlocks();
            update.refreshStage();
            $('#button').removeClass('start');
            $('#button').addClass('pause');
            $('#button').text('PAUSE').fadeIn();
            isPlaying = 2;
        }
    });
    
});