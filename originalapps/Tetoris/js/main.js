'use strict';
{
    // canvas領域の取得
    let droparea = document.getElementById("droparea");
    let nextbox = document.getElementById("nextbox");
    let ctx1 = droparea.getContext('2d');
    let ctx2 = nextbox.getContext('2d');

    // その他変数
    let timeoutId;
    let isStarted = false;
    let cellsize = 25;
    let loopcnt = 0;
    let startX = cellsize * 2;
    let startY = 0;
    let blocks = [];
    let adjustedsize = cellsize - 1;
    let stageheight = droparea.height / cellsize;
    let stagewidth = droparea.width / cellsize;
    let virtualstage = [];
    let nextblock,currentblock,type;
    let angle = 0;

    // 現在のステージ状態を二次元配列で定義
    virtualstage = new Array(stagewidth);
    for (let i = 0; i < virtualstage.length; i++) {
        virtualstage[i] = new Array(stageheight).fill(null);
    }
    
    /** ブロックの定義*/ 
    function createBlocks() {
        blocks = [
            // 水色長ブロック
            {
            shape: [[[-1, 1], [0, 1], [1, 1], [2, 1]],
                    [[0, -1], [0, 0], [0, 1], [0, 2]],
                    [[-1, 0], [0, 0], [1, 0], [2, 0]],
                    [[0, -1], [0, 0], [0, 1], [0, 2]]],
                    color: '#0ff',
                    border: '#fff',
                    shadow: '#088',
                    index: 0
            },
            // 黄色正方形ブロック
            {
            shape: [[[0, 0], [1, 0], [0, 1], [1, 1]],
                    [[0, 0], [1, 0], [0, 1], [1, 1]],
                    [[0, 0], [1, 0], [0, 1], [1, 1]],
                    [[0, 0], [1, 0], [0, 1], [1, 1]]],
                    color: '#ff0',
                    border: '#fff',
                    shadow: '#880',
                    index: 1
            },
            // 緑色Ｚブロック
            {
            shape: [[[0, 0], [1, 0], [-1, 1], [0, 1]],
                    [[-1, -1], [-1, 0], [0, 0], [0, 1]],
                    [[0, 0], [1, 0], [-1, 1], [0, 1]],
                    [[-1, -1], [-1, 0], [0, 0], [0, 1]]],
                    color: '#0f0',
                    border: '#fff',
                    shadow: '#080',
                    index: 2
            },
            // 赤色Ｚブロック
            {
            shape: [[[-1, 0], [0, 0], [0, 1], [1, 1]],
                    [[0, -1], [-1, 0], [0, 0], [-1, 1]],
                    [[-1, 0], [0, 0], [0, 1], [1, 1]],
                    [[0, -1], [-1, 0], [0, 0], [-1, 1]]],
                    color: '#f00',
                    border: '#fff',
                    shadow: '#800',
                    index: 3
            },
            // 青色Ｌブロック
            {
            shape: [[[-1, 0], [-1, 1], [0, 1], [1, 1]],
                    [[0, -1], [1, -1], [0, 0], [0, 1]],
                    [[-1, 0], [0, 0], [1, 0], [1, 1]],
                    [[0, -1], [0, 0], [-1, 1], [0, 1]]],
                    color: '#00f',
                    border: '#fff',
                    shadow: '#008',
                    index: 4
            },
            // オレンジＬブロック
            {
            shape: [[[1, 0], [-1, 1], [0, 1], [1, 1]],
                    [[0, -1], [0, 0], [0, 1], [1, 1]],
                    [[-1, 0], [0, 0], [1, 0], [-1, 1]],
                    [[-1, -1], [0, -1], [0, 0], [0, 1]]],
                    color: '#f90',
                    border: '#fff',
                    shadow: '#840',
                    index: 5
            },
            // 紫凸ブロック
            {
            shape: [[[0, 0], [-1, 1], [0, 1], [1, 1]],
                    [[0, -1], [0, 0], [1, 0], [0, 1]],
                    [[-1, 0], [0, 0], [1, 0], [0, 1]],
                    [[0, -1], [-1, 0], [0, 0], [0, 1]]],
                    color: '#f0f',
                    border: '#fff',
                    shadow: '#808',
                    index: 6
            },
        ];
        return blocks;
    }
    
    /** nextブロック */
    let Blocks = function() {
        // NEXTブロックを表示する
        this.drawNext = function() {
            nextblock = createBlocks()[Math.floor(Math.random() * blocks.length)];
            // 表示位置の微調整
            let adjustedPadX,adjustedPadY;
            if (nextblock.color == '#00f' || nextblock.color == '#f90' || nextblock.color == '#f0f') {
                adjustedPadX = 60;
                adjustedPadY = 40;
            }
            if (nextblock.color == '#0f0' || nextblock.color == '#f00') {
                adjustedPadX = 60;
                adjustedPadY = 40;
            } 
            if (nextblock.color == '#0ff') {
                adjustedPadX = 50;
                adjustedPadY = 30;
            }
            if (nextblock.color == '#ff0') {
                adjustedPadX = 50;
                adjustedPadY = 40;
            }
            for (let i = 0; i < nextblock.shape[0].length; i++) {
                this.drawCell(
                    ctx2,
                    nextblock.shape[0][i][0] * cellsize + adjustedPadX,
                    nextblock.shape[0][i][1] * cellsize + adjustedPadY,
                    nextblock.index
                );
            }
            return nextblock;
        }
        // 描画処理
        this.drawCell = function(ctx, x, y, type) {
            let block = blocks[type];
            // 塗りつぶし
            ctx.fillStyle = block.color;
            let stX = x;
            let stY = y;
            ctx.fillRect(stX, stY, adjustedsize, adjustedsize);
            // 枠線
            ctx.strokeStyle = block.border;
            ctx.beginPath();
            ctx.moveTo(stX, stY + adjustedsize);
            ctx.lineTo(stX, stY);
            ctx.lineTo(stX + adjustedsize, stY);
            ctx.stroke();
            // 影
            ctx.strokeStyle = block.shadow;
            ctx.beginPath();
            ctx.moveTo(stX, stY + adjustedsize);
            ctx.lineTo(stX + adjustedsize, stY + adjustedsize);
            ctx.lineTo(stX + adjustedsize, stY);
            ctx.stroke();
        }
    }
    /** メインブロック */
    let CurrentBlocks = function() {
        let blks = new Blocks(); 
        nextblock = blks.drawNext();

        // 以下、currentの処理
        this.startGame = function() {      
            this.fallblock();
        }
        // 指定秒数ごとに落下処理
        this.fallblock = function() {
            ctx1.clearRect(0, 0, droparea.width, droparea.height);  
            this.createNewblock();
            timeoutId = setTimeout(() => {
                this.fallblock();
            }, 300);
        }
        this.createNewblock = function() {
            if (!isStarted) {
                startY = -cellsize;
                // 初回落下のみランダム
                if (loopcnt == 0) {
                    currentblock = createBlocks()[Math.floor(Math.random() * blocks.length)];
                    type = blocks.indexOf(currentblock);
                    console.log(type);
                }
            }
            

            let sx = (startX + cellsize * 2) / cellsize;
            let sy = (startY + cellsize) / cellsize;

            // checkblockmoveの結果がfalseであれば落下停止
            if (!this.checkblockmove(sx, sy)) {
                this.fixblock(sx, sy);
            // 他ブロックに衝突していない且つ下まで来てない場合は落下継続
            } else if (startY / cellsize < stageheight) {
                this.updatestage();
                // メイン領域のブロック落下
                for (let i = 0; i < currentblock.shape[angle].length; i++) {
                    blks.drawCell(
                        ctx1,
                        currentblock.shape[angle][i][0] * cellsize + startX + cellsize * 2,
                        currentblock.shape[angle][i][1] * cellsize + startY,
                        currentblock.index
                    );
                }
                startY += cellsize;
                isStarted = true;
            }            
        }
        // ブロック落下チェック
        this.checkblockmove = function(sx, sy) {
            let cx, cy;
            for (let i = 0; i < blocks[type].shape[angle].length; i++) {
                cx = sx + blocks[type].shape[angle][i][0];
                cy = sy + blocks[type].shape[angle][i][1] - 1;
                // 下まで来たら,または他ブロックに衝突したら落下停止
                if (stageheight == sy || virtualstage[cx][cy] != null) {
                    return false;
                } 
            }
            return true;
        }
        // ブロック落下を停止
        this.fixblock = function(x, y) {
            // virtualstageを更新
            let cx, cy;
            for (let i = 0; i < blocks[type].shape[angle].length; i++) {
                cx = x + blocks[type].shape[angle][i][0];
                cy = y + blocks[type].shape[angle][i][1] - 2;
                virtualstage[cx][cy] = type;
                console.log(virtualstage);
            }
            // 描画クリア
            ctx2.clearRect(0, 0, nextbox.width, nextbox.height);
            clearTimeout(timeoutId);
            isStarted = false;
            loopcnt++;
            // 最上部まで埋まったらゲームオーバー
            if (cy <= 0) {
                const conf = confirm('Game Over.\nReplay?');
                conf ? window.location.reload() : conf;
            }
            this.updatestage();

            // NEXTのブロックを現在ブロックに指定
            currentblock = nextblock;
            type = blocks[currentblock.index].index;
            // 次NEXTをランダム指定
            nextblock = blks.drawNext();
            // 各種初期化
            startX = cellsize * 2;
            angle = 0;
        }
        // fixした分をステージ状態に反映
        this.updatestage = function() {       
            // virtualstageに基づきステージを再描画
            for (let x = 0; x < virtualstage.length; x++) {
                for (let y = 0; y < virtualstage[x].length; y++) {
                    if (virtualstage[x][y] != null) {
                        blks.drawCell(
                            ctx1,
                            x * cellsize,
                            y * cellsize,
                            virtualstage[x][y]
                        );
                    }
                }
            }
        }
    }
    // ボタン操作各種
    let ManipulateBlocks = function() {
        // 回転
        this.rotate = function() {
            angle++;
            if (angle > 3) {
                angle = 0;
            }
        }
        // 左移動
        this.moveLeft = function() {
            if (startX >= -25) {
                startX -= cellsize;          
            }
        }
        // 右移動
        this.moveRight = function() {
            if (startX <= 250) {
                startX += cellsize;
            }
        }
        // 下移動
        this.moveBottom = function() {
            startY += cellsize*2;
        }
    }

    // 回転
    document.getElementById('btn1').addEventListener('click', () => {
        let manipulate = new ManipulateBlocks();
        manipulate.rotate();
    });
    // 左移動
    document.getElementById('btn2').addEventListener('click', () => {
        let manipulate = new ManipulateBlocks();
        manipulate.moveLeft();
    });
    // 右移動
    document.getElementById('btn4').addEventListener('click', () => {
        let manipulate = new ManipulateBlocks();
        manipulate.moveRight();
    });
    // 下移動
    document.getElementById('btn3').addEventListener('click', () => {
        let manipulate = new ManipulateBlocks();
        manipulate.moveBottom();
    });

    let current = new CurrentBlocks();     
    current.startGame();

    

}