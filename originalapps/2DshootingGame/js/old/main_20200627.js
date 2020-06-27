$(function() {
    'use strict';
    /**ロード時処理 */
    // 定数
    const canvas = document.getElementById('canvasarea');
    const abyss = 20;
    const width = canvas.clientWidth - abyss;
    const height = canvas.clientHeight - abyss;
    const ctx = canvas.getContext('2d');
    const playerImg = document.getElementById('player');
    const enemyImg = document.getElementById('enemy');

    const playerbullet = document.getElementById('playerbullet');
    // プレイヤー弾丸を保持する配列を生成
    let bullets = 20;
    let p_bullets = new Array(bullets);
    for (let i = 0; i < bullets; i++) {
        p_bullets[i] = new Array(3).fill(null);
    }
    // 弾丸初期値
    for (let i = 0; i < bullets; i++) {
        p_bullets[i][0] = 0; // x
        p_bullets[i][1] = 0; // y
        p_bullets[i][2] = 0; // hp
    }
    // キーを定義
    const key_codes = {
        R: 39, // 右
        L: 37, // 左
        S: 32, // スペース
        E: 13 // エンター（ポーズ用）
    }
    const keys = new Array(256);
    for (let i = 0; i < keys.length; i++) {
        keys[i] = false
    }
    // FPSパラメータ
    let fps = 30;
    let mspf = 1000/fps;
    // 敵機＆敵機位置を保持する配列を生成
    let enemies = 10;
    let e_info = new Array(enemies);
    for (let i = 0; i < e_info.length; i++) {
        e_info[i] = new Array(2).fill(null);
    }
    // プレイヤーの位置&HP
    let p_info = {
        x: width / 2,
        y: height - 20,
        hp: 10
    }
    // 敵機初期位置&HPを保持
    for (let i = 0; i < enemies; i++) {
        e_info[i][0] = {x: Math.floor(Math.random() * width)}, 
        e_info[i][1] = {y: Math.floor(Math.random() * height) / 2},
        e_info[i][2] = {hp: 2},
        e_info[i][3] = {isInit: true},
        e_info[i][4] = {onceHit: false}
    }
    // その他変数
    let initFireInterval = 10;
    let fireInterval = 0;
    let initstarInterval = 20;
    let startInterval = 0;
    let restEnemies = 0;
    let hpPer = 7;
    let hpWidth = hpPer*p_info.hp;
    let hpHeight = 5;
    let initFlg = true;
    let remainb = bullets;
    let timeoutId;
    let isPaused = false;
    let pauseInterval = 0;
    let initPauseInterval = 5;

    // ラベル描画用
    let drawLabels = function (font, color, text, x, y) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
    // 描画共通関数
    let redraw = function() {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        // プレイヤーを描画
        if (p_info.hp > 0) {
            ctx.save();
            // プレイヤー実体　ダメージ直後は点滅
            if (startInterval % 2 != 0) {
                ctx.globalAlpha = 0.5;
            }
            ctx.drawImage(playerImg, p_info.x, p_info.y);
            ctx.restore();
            // HPを線で描画
            ctx.fillStyle = '#f00';
            ctx.fillRect(abyss, height+10, hpWidth, hpHeight);
            ctx.fillStyle = '#fff';
            ctx.fillRect(p_info.hp*hpPer+abyss, height+10, hpWidth-p_info.hp*hpPer, hpHeight);
            // 残り弾数を描画
            drawLabels('14px sans-serif', '#050', `bullets:${remainb}`, 10, 30);
        }
        if (p_info.hp <= 0) {
            drawLabels('28px sans-serif', '#f00','Game Over', width/2-70, height/2);
        }
        // 敵機を描画
        for (let i = 0; i < enemies; i++) {
            // 敵機hpが1以上の場合は描画
            if (e_info[i][2].hp > 0) {
                ctx.drawImage(
                    enemyImg, 
                    e_info[i][0].x, 
                    e_info[i][1].y
                );
                // 初期表示時に敵数をカウント
                if (e_info[i][3].isInit) {
                    restEnemies++;
                    e_info[i][3].isInit = false;
                }
            // 撃墜したら残り敵機を減らす
            } else if(e_info[i][2].hp <= 0 && !e_info[i][3].isInit) {
                restEnemies--;
                e_info[i][3].isInit = true;
            }
            // 敵数と撃墜数を表示
            drawLabels('14px sans-serif', '#007', `killed: ${enemies-restEnemies}/${enemies}`, width-70, height+10);
        }
        if (restEnemies <= 0) {
            // ゲームクリア
            drawLabels('28px sans-serif', '#007','Game Clear', width/2-70, height/2);
        }
        // プレイヤー弾丸を描画
        for (let i = 0; i < bullets; i++) {
            if (p_bullets[i][2] > 0 && p_bullets[i][1] > 0) {
                ctx.drawImage(playerbullet, p_bullets[i][0], p_bullets[i][1]);
            } 
        }
    }
    // プレイヤーを動かす
    let moveplayer = function() {
        let pSpeed = 5;
        if (p_info.hp <= 0) {
            return;
        } else {
            // 右
            if (keys[key_codes.R] && p_info.x < width) {
                p_info.x += pSpeed;
            }
            // 左
            if (keys[key_codes.L] && p_info.x > 0) {
                p_info.x -= pSpeed;
            }
            // 弾丸発射
            if (keys[key_codes.S] && fireInterval == 0 && !initFlg) {
                for (let i = 0; i < bullets; i++) {
                    // 発射していない弾がある場合、または残り弾数が1以上の場合は発射
                    if (p_bullets[i][2] == 0 && remainb > 0) {
                        // 弾の初期位置はプレイヤーと同じ位置にする
                        p_bullets[i][0] = p_info.x;
                        p_bullets[i][1] = p_info.y;
                        // 弾のHPを1にする
                        p_bullets[i][2] = 1;
                        // 残り弾数
                        remainb--;
                        fireInterval = initFireInterval;
                        break;
                    }
                }
            } else if (fireInterval > 0) {
                fireInterval--;
            // 初期表示と共に弾が飛ばないようにする
            } else if (initFlg) {
                fireInterval = initFireInterval;
                initFlg = false;
            }
        }
    }

    // プレイヤーの弾丸
    let movePlayerBullets = function() {
        let speed = -6;
        for (let i = 0; i < bullets; i++) {
            // hpが0以下の場合はスキップ
            if (p_bullets[i][2] <= 0) {
                continue;
            } else {
                p_bullets[i][1] += speed;
            }           
        }
    }

    let moveEnemies = function() {
        let eSpeed = 2;
        for (let i = 0; i < enemies; i++) {
            if (e_info[i][2].hp <= 0) {
                continue;
            } else {
                // 下移動
                e_info[i][1].y += eSpeed;
                // 画面下にいったら新しく上から生成
                if (e_info[i][1].y > height) {
                    e_info[i][0].x = Math.floor(Math.random() * width);
                    e_info[i][1].y = 0,
                    e_info[i][4].onceHit = false
                }
            }
        }
    }
    // 当たり判定用関数（obj1とobj2の衝突を判定）
    let collision = function(x1, y1, obj1, x2, y2, obj2) {
        let cx1, cy1, cx2, cy2, r1, r2, d;
        // 中心
        cx1 = x1 + obj1.width / 2;
        cy1 = y1 + obj1.height / 2;
        cx2 = x2 + obj2.width / 2;
        cy2 = y2 + obj2.height / 2;
        // 半径
        r1 = (obj1.width + obj1.height) / 4;
        r2 = (obj2.width + obj2.height) / 4;
        d = Math.sqrt(Math.pow(cx1-cx2, 2) + Math.pow(cy1-cy2, 2));

        return r1+r2 > d;
    }
    // 衝突判定
    let check = function() {
        // 無敵時間の場合は除く   
        if (p_info.hp > 0 && startInterval == 0) {
            // プレイヤーと敵機
            for (let i = 0; i < enemies; i++) {
                if (e_info[i][2].hp > 0) {
                    if (collision(p_info.x, p_info.y, playerImg,
                                        e_info[i][0].x, e_info[i][1].y, enemyImg)) {
                        p_info.hp -= 1;
                        e_info[i][2].hp -= 1;
                        startInterval = initstarInterval;
                    }
                } 
            }
            // プレイヤー弾丸と敵機
            for (let i = 0; i < enemies; i++) {
                if (e_info[i][2].hp > 0) {
                    for (let j = 0; j < bullets; j++) {
                        if (p_bullets[j][2] <= 0) {
                            continue;
                        }
                        if (collision(p_bullets[j][0], p_bullets[j][1], playerbullet,
                                            e_info[i][0].x, e_info[i][1].y, enemyImg)) {
                            p_bullets[j][2] -= 1;
                            e_info[i][2].hp -= 1;
                        }
                    }
                } 
            }   
        }
        if (startInterval > 0) {
            startInterval--;
        }
    }
    let pause = function() {
        if (!isPaused && pauseInterval <= 0) {
            clearTimeout(timeoutId);
            isPaused = true;
        } else if (pauseInterval >= 1){
            pauseInterval--;
        }
    }
    // タイトル表示時
    let blinker = 0;
    let titleloop = function() {
        let startTime = new Date();
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        // スタート画面のラベル描画
        ctx.save();
        ctx.strokeStyle = '#007';
        ctx.beginPath();
        ctx.moveTo(width/2-130, height/2+30);
        ctx.lineTo(width/2+130, height/2+30);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width/2-130, height/2-30);
        ctx.lineTo(width/2+130, height/2-30);
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width/2-150, height/2+50);
        ctx.lineTo(width/2+150, height/2+50);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width/2-150, height/2-50);
        ctx.lineTo(width/2+150, height/2-50);
        ctx.stroke();
    
        ctx.font = 'bold 28px serif';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#007';
        let text = '2d Js Shooting Game';
        ctx.fillText(text, width/2-120, height/2, 500);
        // メッセージの点滅 
        blinker++;
        if (blinker > 1) {
            ctx.globalAlpha = 0.5;
            if (blinker > 3) {
                blinker = 0;
            }
        }
        drawLabels('22px sans serif', '#f09', 'Press SPACE to start', width/2-100, height-60);
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // スペースキーが押されたらメインループスタート
        if (keys[key_codes.S]) {
            mainloop();
            return;
        }
        let deltaTime = (new Date()) - startTime;
        let interval = mspf - deltaTime;
        if (interval > 0) {
           setTimeout(() => {
               titleloop();
           }, interval);
        } else {
            setTimeout(() => {
                titleloop();
            }, 0);
        }
    }

    // メインループ
    let mainloop = function() {
        let startTime = new Date();
        moveplayer();
        movePlayerBullets();
        moveEnemies();
        check();
        redraw();
        let deltaTime = new Date() - startTime;
        let interval = mspf - deltaTime;
        if (interval > 0) {
            timeoutId = setTimeout(() => {
                mainloop();
            }, interval);
        } else {
            timeoutId = setTimeout(() => {
                mainloop();
            }, 0);
        }
        if (keys[key_codes.E]) {
            pause();
        }
    }  
    titleloop();
    /**ここまでロード時処理 */

    /**キーボード */
    document.onkeyup = e => {
        keys[e.keyCode] = false;
    }

    /** ゲームスタート */
    document.onkeydown = e => {
        keys[e.keyCode] = true;
        // ポーズからの再開
        if (isPaused && keys[key_codes.E]) {
            mainloop();
            isPaused = false;
            pauseInterval = initPauseInterval;
        }
    }

});