'use strict';
{
    // canvas領域の取得
    let droparea = document.getElementById("droparea");
    let nextbox = document.getElementById("nextbox");
    let ctx1 = droparea.getContext('2d');
    let ctx2 = nextbox.getContext('2d');

    // その他変数
    let timeoutId;
    let blocks = [];

    // ランダム用
    let Index = Math.floor(Math.random() * blocks.length);
    let Index2 = Math.floor(Math.random() * blocks.length);

    // ブロック描画
    function drawblock(x, y, dx, dy, isMain) {
        isMain ? ctx1.fillRect(x, y, dx, dy) : ctx2.fillRect(x, y, dx, dy);       
    }

    /**next欄にブロックをランダム表示 */
    function displayblock() {
        // 配列初期化
        blocks = [
            {color:'yellow', startX:25, startY:25, drawX:24, drawY:24},
            {color:'lightblue', startX:25, startY:25, drawX:24, drawY:24},
            {color:'blue', startX:35, startY:25, drawX:24, drawY:24},
            {color:'orange', startX:10, startY:50, drawX:24, drawY:24},
            {color:'green', startX:10, startY:50, drawX:24, drawY:24},
            {color:'red', startX:10, startY:25, drawX:24, drawY:24},
            {color:'purple', startX:35, startY:50, drawX:24, drawY:24}
        ];
        ctx2.clearRect(0, 0, nextbox.width, nextbox.height);
        for (let i = 0; i < 4; i++) {
            // 黄色正方形ブロック
            if (blocks[Index].color == 'yellow') {
                ctx2.fillStyle = "#ff0";
                if (i < 2) {
                    blocks[Index].startX += blocks[Index].drawY + 1;
                } else if (i == 2) {
                    blocks[Index].startX -= blocks[Index].drawX + 1;
                    blocks[Index].startY += blocks[Index].drawY + 1;
                } else if (i == 3) {
                    blocks[Index].startX += blocks[Index].drawX + 1;
                }    
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // 水色横長ブロック
            if (blocks[Index].color == 'lightblue') {
                ctx2.fillStyle = "#00c0ff";
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
                blocks[Index].startX += blocks[Index].drawX + 1;
            }
            // 青色Ｌ字ブロック
            if (blocks[Index].color == 'blue') {
                ctx2.fillStyle = "#00f";
                if (i == 1) {
                    blocks[Index].startY += blocks[Index].drawY + 1;
                }
                i > 1 ? blocks[Index].startX += blocks[Index].drawX + 1 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // オレンジ色Ｌ字ブロック
            if (blocks[Index].color == 'orange') {
                ctx2.fillStyle = "#ff7000";
                if (i == 3) {
                    blocks[Index].startY -= blocks[Index].drawY + 1;
                }
                i < 3 ? blocks[Index].startX += blocks[Index].drawX + 1 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // 緑色Ｚ字ブロック
            if (blocks[Index].color == 'green') {
                ctx2.fillStyle = "#00df00";
                if (i == 2) {
                    blocks[Index].startY -= 26;
                }
                i < 2 || i > 2 ? blocks[Index].startX += blocks[Index].drawX + 1 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // 赤色Ｚ字ブロック
            if (blocks[Index].color == 'red') {
                ctx2.fillStyle = "#f00";
                if (i == 2) {
                    blocks[Index].startY += blocks[Index].drawY + 1;
                }
                i < 2 || i > 2 ? blocks[Index].startX += blocks[Index].drawX + 1 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // 紫色凸字ブロック
            if (blocks[Index].color == 'purple') {
                ctx2.fillStyle = "#6f00ff";
                if (i == 1) {
                    blocks[Index].startY -= blocks[Index].drawY + 1;
                    blocks[Index].startX += blocks[Index].drawX + 1;
                }
                if (i == 2) {
                    blocks[Index].startY += blocks[Index].drawY + 1;
                }
                i > 2 ? blocks[Index].startX += blocks[Index].drawX + 1 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
        }
    }
    displayblock();

    const Block = function(x, y, vy) {
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.move = function() {
            // ctx1.clearRect(0, 0, droparea.width, droparea.height);
            ctx1.clearRect(0, 0, droparea.width, this.y);
            // 黄色正方形ブロック
            if (blocks[Index2].color == 'yellow') {
                ctx1.fillStyle = "#ff0";
                this.x = x;
                for (let i = 0; i < 4; i++) {
                    if (i < 2) {
                        this.x += blocks[Index2].drawX + 1;
                    } else if (i == 2) {
                        this.x -= blocks[Index2].drawX + 1;
                        this.y -= blocks[Index2].drawY + 1;
                    } else if (i == 3) {
                        this.x += blocks[Index2].drawX + 1;
                    }    
                    drawblock(this.x, this.y, blocks[Index2].drawX, blocks[Index2].drawY, true);
                }
                this.y += blocks[Index2].drawY + 1;
                this.y += this.vy;
            }
            // 水色横長ブロック
            if (blocks[Index2].color == 'lightblue') {
                ctx1.fillStyle = "#00c0ff";
                this.x = x;
                for (let i = 0; i < 4; i++) {
                    drawblock(this.x, this.y, blocks[Index2].drawX, blocks[Index2].drawY, true);
                    this.x += blocks[Index2].drawX + 1;
                }
                this.y += this.vy;
            }
            // 青色Ｌ字ブロック
            if (blocks[Index2].color == 'blue') {
                ctx1.fillStyle = "#00f";
                this.x = x;
                for (let i = 0; i < 4; i++) {
                    if (i == 3) {
                        this.y -= blocks[Index2].drawY + 1;
                        this.x = x;
                    }
                    drawblock(this.x, this.y, blocks[Index2].drawX, blocks[Index2].drawY, true);
                    i < 3 ? this.x += blocks[Index2].drawX + 1 : this.x += 0;
                }
                this.y += blocks[Index2].drawY + 1;
                this.y += this.vy;
            }
            // オレンジ色Ｌ字ブロック
            if (blocks[Index2].color == 'orange') {
                ctx1.fillStyle = "#ff7000";
                this.x = x;
                for (let i = 0; i < 4; i++) {
                    if (i == 3) {
                        this.y -= blocks[Index2].drawY + 1;
                    }
                    i < 3 ? this.x += blocks[Index2].drawX + 1 : this.x += 0;
                    drawblock(this.x, this.y, blocks[Index2].drawX, blocks[Index2].drawY, true);
                }
                this.y += blocks[Index2].drawY + 1;
                this.y += this.vy;
            }
            // 緑色Ｚ字ブロック
            if (blocks[Index2].color == 'green') {
                ctx1.fillStyle = "#00df00";
                this.x = x;
                for (let i = 0; i < 4; i++) {
                    if (i == 2) {
                        this.y -= blocks[Index2].drawY + 1;
                    }
                    i < 2 || i > 2 ? this.x += blocks[Index2].drawX + 1 : this.x += 0;
                    drawblock(this.x, this.y, blocks[Index2].drawX, blocks[Index2].drawY, true);
                }
                this.y += blocks[Index2].drawY + 1;
                this.y += this.vy;
            }
            // 赤色Ｚ字ブロック
            if (blocks[Index2].color == 'red') {
                ctx1.fillStyle = "#f00";
                this.x = x;
                for (let i = 0; i < 4; i++) {
                    if (i == 2) {
                        this.y -= blocks[Index2].drawY + 1;
                        this.x -= 2 * (blocks[Index2].drawX + 1);
                    }
                    i < 2 || i > 2 ? this.x += blocks[Index2].drawX + 1 : this.x += 0;
                    drawblock(this.x, this.y, blocks[Index2].drawX, blocks[Index2].drawY, true);
                }
                this.y += blocks[Index2].drawY + 1;
                this.y += this.vy;
            }
            // 紫色凸字ブロック
            if (blocks[Index2].color == 'purple') {
                ctx1.fillStyle = "#6f00ff";
                this.x = x;
                for (let i = 0; i < 4; i++) {
                    if (i == 1) {
                        this.y -= blocks[Index].drawY + 1;
                        this.x += blocks[Index].drawX + 1;
                    }
                    if (i == 2) {
                        this.y += blocks[Index].drawY + 1;
                    }
                    i > 2 ? this.x += blocks[Index].drawX + 1 : this.x += 0;
                    drawblock(this.x, this.y, blocks[Index2].drawX, blocks[Index2].drawY, true);
                }
                this.y += this.vy;
            }
            return blocks[Index2].color;
        }
        // ストップ判定
        this.checkCollision = function() {
            // 一番下に来たらストップ
            if (this.y == droparea.offsetHeight) {
                clearTimeout(timeoutId);
                // fallblockを再定義
                fallBlock = new Block(60, 0, 20);
                Index2 = Index;
                update();            
                // 次のnextボックス
                Index = Math.floor(Math.random() * blocks.length);
                displayblock();
            }
        }
    }

    // X始点、Y始点、ブロック一辺サイズ
    let fallBlock = new Block(60, 0, 20);
    
    // 画面描画更新
    function update() {
        fallBlock.move();
        timeoutId = setTimeout(() => {
            update();
        }, 100);
        fallBlock.checkCollision();
    }
    update();
    
    

    
}