'use strict';
{
    // canvas領域の取得
    let droparea = document.getElementById("droparea");
    let nextbox = document.getElementById("nextbox");
    let ctx1 = droparea.getContext('2d');
    let ctx2 = nextbox.getContext('2d');

    // ブロック定義をする配列
    const blocks = [
        {color:'yellow', startX:25, startY:25, drawX:25, drawY:25},
        {color:'lightblue', startX:25, startY:25, drawX:25, drawY:25},
        {color:'blue', startX:35, startY:25, drawX:25, drawY:25},
        {color:'orange', startX:10, startY:50, drawX:25, drawY:25},
        {color:'green', startX:10, startY:50, drawX:25, drawY:25},
        {color:'red', startX:10, startY:25, drawX:25, drawY:25},
        {color:'purple', startX:35, startY:50, drawX:25, drawY:25}
    ];
    // ランダムで一つ取り出す
    let Index = Math.floor(Math.random() * blocks.length);
    let Index2 = Math.floor(Math.random());

    // ブロック描画
    function drawblock(x, y, dx, dy, isMain) {
        isMain ? ctx1.fillRect(x, y, dx, dy) : ctx2.fillRect(x, y, dx, dy);       
    }

    /**next欄にブロックをランダム表示 */
    function displayblock() {
        for (let i = 0; i < 4; i++) {
            // 黄色正方形ブロック
            if (blocks[Index].color == 'yellow') {
                ctx2.fillStyle = "#ff0";
                if (i < 2) {
                    blocks[Index].startX += 26;
                } else if (i == 2) {
                    blocks[Index].startX -= 26;
                    blocks[Index].startY += 26;
                } else if (i == 3) {
                    blocks[Index].startX += 26;
                }    
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // 水色横長ブロック
            if (blocks[Index].color == 'lightblue') {
                ctx2.fillStyle = "#00c0ff";
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
                blocks[Index].startX += 26;
            }
            // 青色Ｌ字ブロック
            if (blocks[Index].color == 'blue') {
                ctx2.fillStyle = "#00f";
                if (i == 1) {
                    blocks[Index].startY += 26;
                }
                i > 1 ? blocks[Index].startX += 26 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // オレンジ色Ｌ字ブロック
            if (blocks[Index].color == 'orange') {
                ctx2.fillStyle = "#ff7000";
                if (i == 3) {
                    blocks[Index].startY -= 26;
                }
                i < 3 ? blocks[Index].startX += 26 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // 緑色Ｚ字ブロック
            if (blocks[Index].color == 'green') {
                ctx2.fillStyle = "#00df00";
                if (i == 2) {
                    blocks[Index].startY -= 26;
                }
                i < 2 || i > 2 ? blocks[Index].startX += 26 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // 赤色Ｚ字ブロック
            if (blocks[Index].color == 'red') {
                ctx2.fillStyle = "#f00";
                if (i == 2) {
                    blocks[Index].startY += 26;
                }
                i < 2 || i > 2 ? blocks[Index].startX += 26 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
            // 紫色凸字ブロック
            if (blocks[Index].color == 'purple') {
                ctx2.fillStyle = "#6f00ff";
                if (i == 1) {
                    blocks[Index].startY -= 26;
                    blocks[Index].startX += 26;
                }
                if (i == 2) {
                    blocks[Index].startY += 26;
                }
                i > 2 ? blocks[Index].startX += 26 : blocks[Index].startX += 0;
                drawblock(blocks[Index].startX, blocks[Index].startY, blocks[Index].drawX, blocks[Index].drawY);
            }
        }
    }
    displayblock();

    function fallblock() {
        ctx1.clearRect(0, 0, droparea.width, droparea.height);
        // 黄色正方形ブロック
        if (blocks[Index2].color == 'yellow') {
            ctx1.fillStyle = "#ff0";
            blocks[Index2].startX = 25;
            for (let i = 0; i < 4; i++) {
                if (i < 2) {
                    blocks[Index2].startX += 26;
                } else if (i == 2) {
                    blocks[Index2].startX -= 26;
                    blocks[Index2].startY += 26;
                } else if (i == 3) {
                    blocks[Index2].startX += 26;
                }    
                drawblock(blocks[Index2].startX, blocks[Index2].startY, blocks[Index2].drawX, blocks[Index2].drawY, true);
            }
            blocks[Index2].startY -= 6;
        }
        // 水色横長ブロック
        if (blocks[Index2].color == 'lightblue') {
            ctx1.fillStyle = "#00c0ff";
            blocks[Index2].startX = 25;
            for (let i = 0; i < 4; i++) {
                drawblock(blocks[Index2].startX, blocks[Index2].startY, blocks[Index2].drawX, blocks[Index2].drawY, true);
                blocks[Index2].startX += 26;
            }
            blocks[Index2].startY += 20;
        }
        // 青色Ｌ字ブロック
        if (blocks[Index2].color == 'blue') {
            ctx1.fillStyle = "#00f";
            blocks[Index2].startX = 35;
            for (let i = 0; i < 4; i++) {
                if (i == 1) {
                    blocks[Index2].startY += 26;
                }
                i > 1 ? blocks[Index2].startX += 26 : blocks[Index2].startX += 0;
                drawblock(blocks[Index2].startX, blocks[Index2].startY, blocks[Index2].drawX, blocks[Index2].drawY, true);
            }
            blocks[Index2].startY -= 6;
        }
        // オレンジ色Ｌ字ブロック
        if (blocks[Index2].color == 'orange') {
            ctx1.fillStyle = "#ff7000";
            blocks[Index2].startX = 10;
            for (let i = 0; i < 4; i++) {
                if (i == 3) {
                    blocks[Index2].startY -= 26;
                }
                i < 3 ? blocks[Index2].startX += 26 : blocks[Index2].startX += 0;
                drawblock(blocks[Index2].startX, blocks[Index2].startY, blocks[Index2].drawX, blocks[Index2].drawY, true);
            }
            blocks[Index2].startY += 46;
        }
        // 緑色Ｚ字ブロック
        if (blocks[Index2].color == 'green') {
            ctx1.fillStyle = "#00df00";
            blocks[Index2].startX = 10;
            for (let i = 0; i < 4; i++) {
                if (i == 2) {
                    blocks[Index2].startY -= 26;
                }
                i < 2 || i > 2 ? blocks[Index2].startX += 26 : blocks[Index2].startX += 0;
                drawblock(blocks[Index2].startX, blocks[Index2].startY, blocks[Index2].drawX, blocks[Index2].drawY, true);
            }
            blocks[Index2].startY += 46;
        }
        // 赤色Ｚ字ブロック
        if (blocks[Index2].color == 'red') {
            ctx1.fillStyle = "#f00";
            blocks[Index2].startX = 10;
            for (let i = 0; i < 4; i++) {
                if (i == 2) {
                    blocks[Index2].startY += 26;
                }
                i < 2 || i > 2 ? blocks[Index2].startX += 26 : blocks[Index2].startX += 0;
                drawblock(blocks[Index2].startX, blocks[Index2].startY, blocks[Index2].drawX, blocks[Index2].drawY, true);
            }
            blocks[Index2].startY -= 6;
        }
        // 紫色凸字ブロック
        if (blocks[Index2].color == 'purple') {
            ctx1.fillStyle = "#6f00ff";
            blocks[Index2].startX = 35;
            for (let i = 0; i < 4; i++) {
                if (i == 1) {
                    blocks[Index2].startY -= 26;
                    blocks[Index2].startX += 26;
                }
                if (i == 2) {
                    blocks[Index2].startY += 26;
                }
                i > 2 ? blocks[Index2].startX += 26 : blocks[Index2].startX += 0;
                drawblock(blocks[Index2].startX, blocks[Index2].startY, blocks[Index2].drawX, blocks[Index2].drawY, true);
            }
            blocks[Index2].startY += 20;
        }
        setTimeout(() => {  
            fallblock();
        }, 1000);
    }
    fallblock();
    
    

    
}