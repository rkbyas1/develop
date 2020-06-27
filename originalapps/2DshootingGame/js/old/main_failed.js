$(function() {
    'use strict';

    /** canvas定義 */
    const canvas = document.getElementById('canvasarea');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const context = canvas.getContext('2d');
    // Img
    const playerImg = document.getElementById('player');
    const enemyImg = document.getElementById('enemy');
    const pBullutImg = document.getElementById('playerbullet');
    const eBullutImg = document.getElementById('enemybullet');
    let enemy, pBullet, drawFlg, isMultiple;
    let enemies = 5;
    let bullets = 5;
    let current = 0;
    let initFlg = true;

    let enemyArray = new Array(enemies);
    for (let i = 0; i < enemyArray.length; i++) {
        enemyArray[i] = new Array(2).fill(null);
    }

    let pBullets = new Array(bullets);
    for (let i = 0; i < pBullets.length; i++) {
        pBullets[i] = new Array(2).fill(null);
    }
    
    function createRandom() {
        return Math.floor(Math.random() * width); 
    }

    /** プレイヤー機 */
    const playerObject = function(player, x, y) {
        this.player = player;
        this.x = x;
        this.y = y;
        this.draw = () => {
            context.drawImage(this.player, this.x, this.y); // 描画対象画像、描画開始X、描画開始Y
        }
        this.move = () => {
            $('body').mousemove(e => {
                this.x = e.clientX - canvas.offsetLeft;
            });
        }
    }

    /** 敵機 */
    const enemyEntity = function(enemy, x, y) {
        this.enemy = enemy;
        this.x = x;
        this.y = y;
        this.vy = 3;
        this.draw = () => {
            context.drawImage(this.enemy, this.x, this.y);
        }
        this.move = () => {
            return this.y += this.vy;
        }
    }

    /** 弾丸 */
    const playerBullet = function(bullet, x, y) {
        this.bullet = bullet;
        this.x = x;
        this.y = y;
        this.vy = 5;
        this.draw = () => {
            context.drawImage(this.bullet, this.x, this.y);
        }
        this.move = () => {
            this.y -= this.vy;
        }
    }

    /** ステージ状態更新 */
    const updateStage = function() {
        this.clear = () => {
            context.clearRect(0, 0, width, height);
        }
        this.refresh = () => {
            this.clear();
            player.draw();
            player.move();
            /** ロード時はランダムな位置にenemy数分描画 */
            for (let i = 0; i < enemies; i++) {
                if (initFlg) {
                    enemyArray[i][0] = createRandom();
                    enemyArray[i][1] = 10;
                }
                enemy = new enemyEntity(enemyImg, enemyArray[i][0], enemyArray[i][1]);    
                enemyArray[i][1] = enemy.move();
                enemy.draw();
            }   
            $('body').click(e => {
                for (let i = 0; i < bullets; i++) {
                    if (i == 0) {
                        pBullets[i][0] = player.x;
                        pBullets[i][1] = player.y;
                        current++;
                    }
                    pBullet = new playerBullet(pBullutImg, pBullets[i][0], pBullets[i][1]);
                    drawFlg = true;       
                    break;
                }
            });
            if (drawFlg) {
                for (let i = 0; i < current; i++) {
                    pBullet.x = pBullets[i][0];
                    pBullet.draw();         
                    pBullet.move();  
                }
            }
            
            initFlg = false;
            setTimeout(() => {
                this.refresh();
            }, 20);
        }
    }

    
    
    const player = new playerObject(playerImg, width/2, height-30);
    
    const update = new updateStage;
    update.refresh();

});