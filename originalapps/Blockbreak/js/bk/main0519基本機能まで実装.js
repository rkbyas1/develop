$(function() {
    /***********************************
     当該アプリは、jQuery&canvasでの実装
    ***********************************/

    /** canvas定義 */
    const canvas = document.getElementById('canvasarea');
    const height = canvas.clientHeight;
    const width = canvas.clientWidth;
    const ctx = canvas.getContext('2d');

    /** 変数定義*/ 
    let score = 0;
    let lives = 5;
    let paddleMove = 20;
    let virtualBlocks = [];
    const blockDefs = {
        cols: 5,
        rows: 3
    }
    virtualBlocks = new Array(blockDefs.cols);
    for (let i = 0; i < virtualBlocks.length; i++) {
        virtualBlocks[i] = new Array(blockDefs.rows).fill(null);
    }

    /** 乱数生成用 */
    const RandomNumber = function() {
        this.generate = (max, min) => {
            return Math.floor(Math.random() * (max-min) + min);
        }
    }

    /** スコア描画 */
    const scoreLabel = function(x, y) {
        this.x = x;
        this.y = y;
        this.draw = text => {
            ctx.font = 'bold 16px "Century Gothic"';
            ctx.fillStyle = '#35f';
            ctx.textAlign = 'right';
            ctx.fillText(text,this.x,this.y);
        }
    }
    /** 残りライフ描画 */
    const livesLabel = function(x, y) {
        this.x = x;
        this.y = y;
        this.draw = text => {
            ctx.font = 'bold 16px "Century Gothic"';
            ctx.fillStyle = '#35f';
            ctx.textAlign = 'right';
            ctx.fillText(text,this.x,this.y);
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
            vx: rand.generate(5, -5),
            vy: rand.generate(7, 3)
        }
        this.draw = ()=> {
            ctx.beginPath();
            ctx.fillStyle = '#ff0000';
            ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
            ctx.fill();
            // $('#point').innerHTML = `${this.x}:${this.y}`
            console.log(`${this.x}:${this.y}`);
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
            } else if (this.y > height){
                alert('Game Over');
            }
            // 左右
            if ((this.x + this.r > width) || (this.x - this.r < 0)){
                this.ballSpeed.vx *= -1;
            }
        }
        // ブロック衝突＆消去＆ボール反転
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
            sLabel.draw(`Score:${score}`);
            lLabel.draw(`Lives:${lives}`);
            paddle.draw();
            paddle.move();
            ball.draw();
            ball.move();
            ball.paddleCollision();
            blocks.drawBlocks();
            ball.blockCollision();
            setTimeout(() => {
                this.refreshStage();  
            }, paddleMove);
        }
    }
    /** ブロック*/
    const blocksEntity = function(x, y, w, h, d) {
        // 初期ブロック描画可否判定用に仮値を保持
        this.createBlocks = ()=> {
            for (let i = 0; i < blockDefs.cols; i++) {
                for (let j = 0; j < blockDefs.rows; j++) {
                    virtualBlocks[i][j] = 1;
                }
            }
        }
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
                this.x += this.w + this.d;
                this.y = y;
            }           
        }
    }

    /** インスタンス宣言 */ 
    const rand = new RandomNumber();
    const sLabel = new scoreLabel(80, 25);
    const lLabel = new livesLabel(480, 25);
    const paddle = new paddleEntity(120, 15);  //パドル幅 パドル高さ
    const update = new updateStage();
    const ball = new ballEntity(rand.generate(480, 20), rand.generate(20, 10), 10); // 中心x 中心y 半径r
    const blocks = new blocksEntity(20, 40, 80, 20, 10); // X Y 横幅 縦幅 間隔 
    
    /** ゲームスタート*/ 
    $('#start').click(()=> {
        blocks.createBlocks();
        update.refreshStage();
    });
    
});