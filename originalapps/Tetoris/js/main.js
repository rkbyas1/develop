'use strict';
{
    // 領域の取得
    const droparea = document.getElementById("droparea");
    const nextbox = document.getElementById("nextbox");
    const ctx1 = droparea.getContext('2d');
    const ctx2 = nextbox.getContext('2d');
    const point = document.getElementById("points");
    const msg = document.getElementById('msg');
    msg.classList.add('hidden');
    const level = document.getElementById('level');
    const stop = document.getElementById('pause');

    // その他変数
    let timeoutId;
    let isStarted = false;
    let isMoved = false;
    let deletedLines = 0;
    let cellsize = 25;
    let loopcnt = 0;
    let startX = cellsize * 2;
    let startY = 0;
    let sx,sy;
    let blocks = [];
    let adjustedsize = cellsize - 1;
    let stageheight = droparea.height / cellsize;
    let stagewidth = droparea.width / cellsize;
    let virtualstage = [];
    let nextblock,currentblock,type,rowIndex;
    let angle = 0;
    let prevScore = 0;
    let score = 0;
    let speed = 1000;
    let levelswitch = 3;
    let lev = 1;
    let paused;

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
                    [[-1, -2], [-1, -1], [-1, 0], [-1, 1]],
                    [[-1, 1], [0, 1], [1, 1], [2, 1]],
                    [[-1, -2], [-1, -1], [-1, 0], [-1, 1]]],
                    color: '#0ff',
                    border: '#fff',
                    shadow: '#088',
                    index: 0
            },
            // 黄色正方形ブロック
            {
            shape: [[[-1, 0], [0, 0], [-1, 1], [0, 1]],
                    [[-1, 0], [0, 0], [-1, 1], [0, 1]],
                    [[-1, 0], [0, 0], [-1, 1], [0, 1]],
                    [[-1, 0], [0, 0], [-1, 1], [0, 1]]],
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
                    [[-1, -1], [0, -1], [-1, 0], [-1, 1]],
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
                    [[-1, -1], [-1, 0], [-1, 1], [0, 1]],
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
                    [[-1, -1], [-1, 0], [0, 0], [-1, 1]],
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
                adjustedPadX = 75;
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
            this.createNewblock();
            timeoutId = setTimeout(() => {
                this.fallblock();
            }, speed);
        }
        this.createNewblock = function() { 
            if (!isStarted) {
                startY = -cellsize;
                // 初回落下のみランダム
                if (loopcnt == 0) {
                    currentblock = createBlocks()[Math.floor(Math.random() * blocks.length)];
                    type = blocks.indexOf(currentblock);
                }
            }
            sx = (startX + cellsize * 2) / cellsize;
            sy = (startY + cellsize) / cellsize;

            // checkblockmoveの結果がfalseであれば落下停止
            if (this.checkblockmove(sx, sy) == 3) {
                if (isMoved) {
                    sx--;
                }
                this.fixblock(sx, sy);
            // 他ブロックに衝突していない且つ下まで来てない場合は落下継続
            } else {
                this.redrawstage();
                this.updatestage();
                isMoved = false;
            }            
        }
        // メイン領域のブロック落下
        this.updatestage = function() {
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
        // ブロック落下チェック
        // return 1:左右上下移動可　2:上下のみ移動可　3:停止
        this.checkblockmove = function(sx, sy) {
            let cx, cy;
            for (let i = 0; i < blocks[type].shape[angle].length; i++) {
                cx = sx + blocks[type].shape[angle][i][0];
                cy = sy + blocks[type].shape[angle][i][1] - 1;
                // 下まで来たら,または他ブロックに衝突したら落下停止
                if (stageheight <= cy || virtualstage[cx][cy] != null) {
                    if (isMoved && virtualstage[cx][cy] != null) {
                        return 2;
                    } else {
                        return 3;
                    }
                }
            }
            return 1;
        }
        // ブロック落下を停止
        this.fixblock = function(x, y) {
            // virtualstageを更新
            let cx, cy;
            for (let i = 0; i < blocks[type].shape[angle].length; i++) {
                cx = x + blocks[type].shape[angle][i][0];
                cy = y + blocks[type].shape[angle][i][1] - 2;
                virtualstage[cx][cy] = type;
            }
            this.deleteRow();

            // 描画クリア
            ctx2.clearRect(0, 0, nextbox.width, nextbox.height);
            clearTimeout(timeoutId);
            isStarted = false;
            loopcnt++;
            // 最上部まで埋まったらゲームオーバー
            if (cy <= 0) {
                const replay = confirm(`Game Over. \nYour Score is ${score} \nReplay?`);
                replay ? window.location.reload() : replay;
            }
            // ステージを更新
            this.redrawstage();
            // 行消しがあればステージを再描画
            if (deletedLines > 0) {
                this.afterdelete();
                switch (deletedLines) {
                    case 1:
                        score += deletedLines;
                        break;
                    case 2:
                        score += deletedLines + 1;
                        break;
                    case 3:
                        score += deletedLines + 2;
                        break;
                    case 4:
                        score += deletedLines + 3;
                        break;
                }
                point.innerHTML = `　SCORE:${score}`;
                // 5ポイントごとに速度アップ
                for (let i = score; i > prevScore; i--) {
                    if (i % levelswitch == 0) {
                        speed -= 100;
                        lev++;
                        msg.classList.remove('hidden');
                        msg.innerHTML = `+${score - prevScore} Score! <br>LEVEL UP TO ${lev}`;
                        level.innerHTML = `　LEVEL:${lev}`;
                        setTimeout(() => {
                            msg.classList.add('hidden');
                        }, 500);
                    }  
                }
                prevScore = score;
            }
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
        this.redrawstage = function() {  
            ctx1.clearRect(0, 0, droparea.width, droparea.height);      
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
        // 一行埋まったらその行を消去する
        this.deleteRow = function() {
            let cnt = 0;
            let y2 = 0;
            deletedLines = 0;
            rowIndex = '';
            for (let w = 0; w < virtualstage[0].length; w++) {
                cnt = 0;
                for (let x = 0; x < virtualstage.length; x++) {
                    for (let y = y2; y < y2+1; y++) {
                        virtualstage[x][y] != null ? cnt++ : cnt = 0;
                        // 一行全てブロックが埋まっていたら値をnullにする
                        if (cnt == stagewidth && x == 9) {
                            for (let x2 = x; x2 >= 0; x2--) {
                                virtualstage[x2][y] = null;
                            }
                            // 消去した行数
                            deletedLines++;
                            // 消去行のIndex番号
                            rowIndex = y;
                        }
                    }
                } 
                y2++;
            }
        }
        // 行消した後にvirtualstageを更新
        this.afterdelete = function() {
            for (let x = 0; x < virtualstage.length; x++) {
                for (let y = rowIndex; y >= 0; y--) {
                    if (y == 0) {
                        continue;
                    } else {
                        virtualstage[x][y] = virtualstage[x][y-deletedLines];
                    }
                }
            }
        }
        // ブロック情報を返却用メソッド
        this.returnInfo = function() {
            return {
                t: type,
                a: angle
            }
        }
    }
    let current = new CurrentBlocks();  
    current.startGame();
       
    /** ボタン操作各種*/ 
    let ManipulateBlocks = function() {
        // info[t:type a:angle]
        let info = current.returnInfo();
        // 回転
        this.rotate = function() {
            isMoved = true
            angle++;
            if (angle > 3) {
                angle = 0;
            }
            // ブロック種類ごとに回転位置を調整
            if (info.t == 0 && (info.a == 1 || info.a == 3)) {
                startX -= cellsize*3;
            }
            if (info.t == 0 && (info.a == 0 || info.a == 2)) {
                startX += cellsize*3;
            }
            if (info.t == 0 && sx < 3 && (info.a == 1 || info.a == 3)) {
                startX += cellsize*3;
            }
            if (info.t == 0 && sx < 3 && (info.a == 0 || info.a == 2)) {
                startX -= cellsize*3;
            }
            if ((info.t == 2 || info.t == 3 || info.t == 4 || info.t == 5 || info.t == 6) 
                && (info.a == 1 || info.a == 3) && sx > 2) {
                startX -= cellsize;
            }
            if ((info.t == 2 || info.t == 3 || info.t == 4 || info.t == 5 || info.t == 6) 
                && (info.a == 0 || info.a == 2) && sx > 2) {
                startX += cellsize;
            }
            // 移動後ブロックの位置を再描画
            let bx = (startX + cellsize * 2) / cellsize;
            let by = (startY + cellsize) / cellsize;
            if (current.checkblockmove(bx, by) == 1) {
                startY -= cellsize;
                current.redrawstage();
                current.updatestage();
            } else {
                return;
            }
        }
        // 左移動
        this.moveLeft = function() {
            // 移動後ブロックの位置を再描画
            let bx = (startX + cellsize * 2) / cellsize;
            let by = (startY + cellsize) / cellsize;
            if (current.checkblockmove(bx, by) == 1) {
                // 赤
                if (sx > 1) {
                    startX -= cellsize;     
                }
                startY -= cellsize;
                current.redrawstage();
                current.updatestage();
            } else {
                return;
            }
        }
        // 右移動
        this.moveRight = function() {
            isMoved = true;
            // ブロック種類ごとに移動制限範囲を調整
            if (info.t == 0 && (info.a == 0 || info.a == 2)) {
                if (sx < stagewidth-3) {
                    startX += cellsize;
                }
            }
            if (info.t == 0 && (info.a == 1 || info.a == 3)) {
                if (sx < stagewidth) {
                    startX += cellsize
                } 
            }
            if ((info.t == 2 || info.t == 3 || info.t == 4 || info.t == 5 || info.t == 6) 
                && (info.a == 0 || info.a == 2)) {
                if (sx < stagewidth-2) {
                    startX += cellsize;
                } 
            
            } else if (info.t != 0 && sx < stagewidth-1) {  
                startX += cellsize;
            }
            // 移動後ブロックの位置を再描画
            let bx = (startX + cellsize * 2) / cellsize;
            let by = (startY + cellsize) / cellsize;
            if (current.checkblockmove(bx, by) == 1) {
                startY -= cellsize;
                current.redrawstage();
                current.updatestage();
            }
            if (current.checkblockmove(bx, by) == 2) {
                startX -= cellsize;
                startY -= cellsize;
                current.redrawstage();
                current.updatestage();
            } else {
                return;
            }
        }
        // 下移動
        this.moveBottom = function() {
            let bx = (startX + cellsize * 2) / cellsize;
            let by = (startY + cellsize) / cellsize;
            if (current.checkblockmove(bx, by) == 1) {
                current.redrawstage();
                current.updatestage();
            } else {
                return;
            }
        }
        // 一時停止 
        this.pause = function() {
            if (!paused) {
                clearTimeout(timeoutId);
                paused = true;
                stop.style.background = '#f0f';
                stop.innerHTML = 'Restart';
            } else {
                current.startGame()
                paused = false;
                stop.style.background = '#0f0';
                stop.innerHTML = 'Pause';
            }
        }
    }

    // 回転
    const rot = document.getElementById('btn1');
    rot.addEventListener('click', () => {
        let manipulate = new ManipulateBlocks();
        manipulate.rotate();
    });
    
    // 左移動
    const left = document.getElementById('btn2');
    left.addEventListener('click', () => {
        let manipulate = new ManipulateBlocks();
        manipulate.moveLeft();
    });

    // 右移動
    const right = document.getElementById('btn4');
    right.addEventListener('click', () => {
        let manipulate = new ManipulateBlocks();
        manipulate.moveRight();
    });

    // 下移動
    const bottom = document.getElementById('btn3');
    bottom.addEventListener('click', e => {
        let manipulate = new ManipulateBlocks();
        manipulate.moveBottom();
    });
    
    // 一時停止
    stop.addEventListener('click', ()=> {
        let manipulate = new ManipulateBlocks();
        manipulate.pause();
    });

    // キーボードで操作の代用可
    document.addEventListener('keydown', e => {
        let manipulate = new ManipulateBlocks();
        switch (e.keyCode) {
            case 32:
                manipulate.pause();
                break;
            case 37:
                manipulate.moveLeft();
                break;
            case 38:
                manipulate.rotate();
                break;
            case 39:
                manipulate.moveRight();
                break;
            case 40:
                manipulate.moveBottom();
                break;
        }
    });



    

}