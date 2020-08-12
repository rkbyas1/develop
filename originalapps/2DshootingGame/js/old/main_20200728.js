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
    const enemybullet = document.getElementById('enemybullet');
    // 機能拡張より
    const pulseImg = document.getElementById('pulse');
    const seekerImg = document.getElementById('missiles');
    // タイマー用
    let loopStart, ellapsedTime, pauseStart;
    let m,s;
    
    // プレイヤー弾丸の定義（位置、HP）
    let bullets = 20;
    let seekers = 5;
    let pulse = 20;
    let p_bullets, p_seeker, p_pulse;
    let remainb = bullets;
    let remainSeeker = seekers;
    let remainPulse = pulse;
    let definePlayerBullets = function() {
        /** 普通弾（レーザー） */
        this.laser = added => {
            if (added) {
                bullets = remainb;
            }
            p_bullets = new Array(bullets);
            for (let i = 0; i < bullets; i++) {
                p_bullets[i] = new Array(3).fill(null);
            }
            // 弾丸初期値
            for (let i = 0; i < bullets; i++) {
                p_bullets[i][0] = 0; // x
                p_bullets[i][1] = 0; // y
                p_bullets[i][2] = 0; // hp
            }
        }
        /** シーカーミサイル */
        this.seeker = ()=> {
            seekers = remainSeeker;
            p_seeker = new Array(seekers);
            for (let i = 0; i < seekers; i++) {
                p_seeker[i] = new Array(3).fill(null);
            }
            for (let i = 0; i < seekers; i++) {
                p_seeker[i][0] = 0; // x
                p_seeker[i][1] = 0; // y
                p_seeker[i][2] = 0; // hp
            }
        }
        /** パルスキャノン */
        this.pulse = () => {
            pulse = remainPulse;
            p_pulse = new Array(pulse);
            for (let i = 0; i < pulse; i++) {
                p_pulse[i] = new Array(3).fill(null);
            }
            for (let i = 0; i < pulse; i++) {
                p_pulse[i][0] = 0; // x
                p_pulse[i][1] = 0; // y
                p_pulse[i][2] = 0; // hp
            }
        }
    }
    let playerBullets = new definePlayerBullets();
    playerBullets.laser();
    playerBullets.seeker();
    playerBullets.pulse();

    // キーを定義
    const key_codes = {
        R: 39, // 右
        L: 37, // 左
        U: 38, // 上
        D: 40, // 下
        S: 32, // スペース
        E: 13, // エンター
        SH: 16 // shift（パルス）
    }
    const keys = new Array(256);
    for (let i = 0; i < keys.length; i++) {
        keys[i] = false
    }
    // FPSパラメータ
    let fps = 30;
    let mspf = 1000/fps;
    // 敵機＆敵機位置を保持する配列を生成
    let enemies = 3;
    let e_info;
    // プレイヤーの位置&HP
    let p_info = {
        x: width / 2,
        y: height - 20,
        hp: 10
    }
    // 敵機初期位置&HPを保持
    let defineEnemies = function() {
        e_info = new Array(enemies);
        for (let i = 0; i < e_info.length; i++) {
            e_info[i] = new Array(2).fill(null);
        }
        for (let i = 0; i < enemies; i++) {
            e_info[i][0] = {x: Math.floor(Math.random() * width)}, 
            e_info[i][1] = {y: Math.floor(Math.random() * height/3)},
            e_info[i][2] = {hp: 3},
            e_info[i][3] = {isInit: true},
            e_info[i][4] = {onceHit: false}
        }
    }
    defineEnemies();

    // 敵機弾丸を定義
    let ebullets = 10;
    let e_bullets;
    let defineEnemyBullets = function() {
        e_bullets = new Array(enemies);
        for (let j = 0; j < enemies; j++) {
            e_bullets[j] = new Array(ebullets);
            for (let i = 0; i < ebullets; i++) {
                e_bullets[j][i] = new Array(3).fill(null);
            }
        }
        // 弾丸初期値
        for (let j = 0; j < enemies; j++) {
            for (let i = 0; i < ebullets; i++) {
                e_bullets[j][i][0] = 0; // x
                e_bullets[j][i][1] = 0; // y
                e_bullets[j][i][2] = 0; // hp
            }
        }
    }
    defineEnemyBullets();

    // その他変数
    let eSpeed = 2;
    let ebSpeed = 6;
    let pbSpeed = -6;
    let initFireInterval = 10;
    let fireInterval = 0;
    let ebulletInterval = 30;
    let initstarInterval = 20;
    let startInterval = 0;
    let restEnemies = 0;
    let clearInterval = 5;
    let gameOverInterval = 5;
    let hpPer = 7;
    let hpWidth = hpPer*p_info.hp;
    let hpHeight = 5;
    let initFlg = true;
    let timeoutId,point;
    let bpoint = 0,totalTime = 0, bonusPoint;
    let isPaused = false;
    let cleared = false;
    let gameOver = false, completed = false;
    let stage = 1;
    let shot = 0;
    let level = 1;
    let titleloopInterval = 0;

    // ラベル描画用
    let drawLabels = function (font, color, text, x, y) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
    let pointCalc = function() {
        bpoint = remainb*2 + remainSeeker*5 + remainPulse*3;
        totalTime = Number(m*60) + Number(s);
        point = (bonusPoint * shot * p_info.hp * bpoint) / totalTime; 

        return Math.round(point);
    }
    // 描画共通関数
    let redraw = function() {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        pointCalc();
        // プレイヤーを描画
        if (p_info.hp > 0) {
            ctx.save();
            // プレイヤー実体　ダメージ直後は点滅
            if (startInterval % 2 != 0) {
                ctx.globalAlpha = 0.5;
            }
            ctx.drawImage(playerImg, p_info.x, p_info.y);
            ctx.restore();
            // HPを線で表示
            ctx.fillStyle = '#f00';
            ctx.fillRect(abyss, height+10, hpWidth, hpHeight);
            ctx.fillStyle = '#fff';
            ctx.fillRect(p_info.hp*hpPer+abyss, height+10, hpWidth-p_info.hp*hpPer, hpHeight);
            // 残り弾数を表示
            drawLabels('bold 14px sans-serif', '#050', `laser:${remainb}`, 10, 30);
            // 残りseeker数を表示
            drawLabels('bold 14px sans-serif', '#050', `seeker:${remainSeeker}`, 10, 50);
            // 残りpulse数を表示
            drawLabels('bold 14px sans-serif', '#050', `pulse:${remainPulse}`, 10, 70);
            // 現在レベルを表示
            drawLabels('bold 14px sans-serif', '#007', `Stage:${stage}`, width-70, 30);
            // 敵数と撃墜数を表示
            drawLabels('14px sans-serif', '#007', `killed: ${enemies-restEnemies}/${enemies}`, width-70, height+10);
            // 撃墜数合計を表示
            drawLabels('14px sans-serif', '#007', `total killed:${shot}`, width-100, 50);
            // 経過時間
            drawLabels('14px sans-serif', '#007', `time:${m}:${s}`, width-80, 70);
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
                    // 敵機の弾丸を描画
                    for (let i = 0; i < enemies; i++) {
                        for (let j = 0; j < ebullets; j++) {
                            if (e_bullets[i][j][2] > 0 && e_bullets[i][j][1] > 0) {
                                ctx.drawImage(enemybullet, e_bullets[i][j][0], e_bullets[i][j][1]);
                            }
                        }
                    }
                    // プレイヤー弾丸（laser）を描画
                    for (let i = 0; i < bullets; i++) {
                        // hpが1以上、yがcanvas枠内にある場合は描画
                        if (p_bullets[i][2] > 0 && p_bullets[i][1] > 0) {
                            ctx.drawImage(playerbullet, p_bullets[i][0], p_bullets[i][1]);
                        } 
                    }
                    // プレイヤー弾丸（seeker）を描画
                    for (let i = 0; i < seekers; i++) {
                        // hpが1以上、yがcanvas枠内にある場合は描画
                        if (p_seeker[i][2] > 0 && p_seeker[i][1] > 0) {
                            ctx.drawImage(seekerImg, p_seeker[i][0], p_seeker[i][1]);
                        } 
                    }
                    // プレイヤー弾丸（pulse）を描画
                    for (let i = 0; i < pulse; i++) {
                        // hpが1以上、yがcanvas枠内にある場合は描画
                        if (p_pulse[i][2] > 0 && p_pulse[i][1] > 0) {
                            ctx.drawImage(pulseImg, p_pulse[i][0], p_pulse[i][1]);
                        } 
                    }
                // 撃墜したら残り敵機を減らす
                } else if (e_info[i][2].hp <= 0 && !e_info[i][3].isInit) {
                    restEnemies--;
                    shot++;
                    e_info[i][3].isInit = true;
                }
            }
        }
        // プレイヤーHPが0になったらゲームオーバー（リザルト画面）
        if (p_info.hp <= 0) {
            if (gameOverInterval == 0) {
                gameOver = true;
                drawLabels('32px sans-serif', '#f00','Game Over', width/2-80, height/2-10);
                drawLabels('22px sans-serif', '#f09','Replay to ENTER', width/2-80, height/2+150);
            } else {
                gameOverInterval--;
            }
        }
        // ゲームクリア時（各ステージ）
        if (restEnemies <= 0 && stage != 2) {
            if (clearInterval <= 0) {
                drawLabels('28px sans-serif', '#007','Game Clear', width/2-70, height/2);
                drawLabels('18px sans-serif', '#00b','Press ENTER to Next Stage', width/2-100, height/2+30);
                cleared = true;
                clearInterval = 5;
                ebulletInterval = 20;
            } else {
                clearInterval--;
            }
            // 全ステージ（10ステージ）クリア時（スコア表示）
        } else if (restEnemies <= 0) {
            if (clearInterval <= 0) {
                completed = true;
                drawLabels('32px sans-serif', '#80f','COMPLETED!', width/2-80, height/2-20);
                let levName;
                switch (level) {
                    case 1:
                        levName = 'NORMAL';
                        bonusPoint = 1;
                        break;
                    case 2:
                        levName = 'HARD';
                        bonusPoint = 3;
                        break;
                    case 3:
                        levName = 'EXPERT';
                        bonusPoint = 7;
                        break;
                }
                drawLabels('18px sans-serif', '#007',`Level: ${levName}  Level point: ${bonusPoint}`, width/2-80, height/2+20);
                drawLabels('18px sans-serif', '#007',`Total killed: ${shot}`, width/2-80, height/2+40);
                drawLabels('18px sans-serif', '#007',`Life point: ${p_info.hp}`, width/2-80, height/2+60);
                drawLabels('18px sans-serif', '#007',`Bullet point: ${bpoint}`, width/2-80, height/2+80);
                drawLabels('18px sans-serif', '#007',`Elapsed time: ${m}'${s}"`, width/2-80, height/2+100);
                drawLabels('18px sans-serif', '#007',`The total point: ${pointCalc()}`, width/2-80, height/2+120);
            } else {
                clearInterval--;
            }
        }
    }
    // プレイヤーを動かす
    let moveplayer = function() {
        let pSpeed = 5;
        if (p_info.hp <= 0) {
            return;
        } else {
            // 右移動
            if (keys[key_codes.R] && p_info.x < width) {
                p_info.x += pSpeed;
            }
            // 左移動
            if (keys[key_codes.L] && p_info.x > 0) {
                p_info.x -= pSpeed;
            }
            // 弾丸発射
            if (keys[key_codes.S] && fireInterval == 0 && !initFlg) {
                // laser
                for (let i = 0; i < bullets; i++) {
                    // 発射していない弾がある場合、且つは残り弾数が1以上の場合は発射
                    if (p_bullets[i][2] == 0 && remainb > 0) {
                        // 弾の初期位置はプレイヤーと同じ位置にする
                        p_bullets[i][0] = p_info.x;
                        p_bullets[i][1] = p_info.y;
                        // hp = 2;
                        p_bullets[i][2] = 2;
                        // 残り弾数
                        remainb--;
                        fireInterval = initFireInterval;
                        break;
                    }
                }
            } else if (keys[key_codes.U] && fireInterval == 0) {
                // seeker
                for (let i = 0; i < seekers; i++) {
                    // 発射していない弾がある場合、且つは残り弾数が1以上の場合は発射
                    if (p_seeker[i][2] == 0 && remainSeeker > 0) {
                        // 弾の初期位置はプレイヤーと同じ位置にする
                        p_seeker[i][0] = p_info.x;
                        p_seeker[i][1] = p_info.y;
                        // hp = 5;
                        p_seeker[i][2] = 5;
                        // 残り弾数
                        remainSeeker--;
                        fireInterval = initFireInterval;
                        break;
                    }
                }
            } else if (keys[key_codes.SH] && fireInterval == 0) {
                // pulse
                for (let i = 0; i < pulse; i++) {
                    // 発射していない弾がある場合、且つは残り弾数が1以上の場合は発射
                    if (p_pulse[i][2] == 0 && remainPulse > 0) {
                        // 弾の初期位置はプレイヤーと同じ位置にする
                        p_pulse[i][0] = p_info.x;
                        p_pulse[i][1] = p_info.y;
                        // hp = 2;
                        p_pulse[i][2] = 2;
                        // 残り弾数
                        remainPulse--;
                        // 間隔短めで連射できるように
                        fireInterval = 2;
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
    // 敵機を動かす
    let moveEnemies = function() {
        for (let i = 0; i < enemies; i++) {
            if (e_info[i][2].hp <= 0) {
                continue;
            } else {
                // 下移動
                e_info[i][1].y += eSpeed;
                // 画面下にいったら新しく上から生成
                if (e_info[i][1].y > height) {
                    e_info[i][0].x = Math.floor(Math.random() * width);
                    e_info[i][1].y = 0;
                    e_info[i][4].onceHit = false;
                    // 弾丸HPをリセット
                    for (let j = 0; j < ebullets; j++) {
                        e_bullets[i][j][2] = 0;
                    }
                }
            }
            // 敵弾丸発射
            if (ebulletInterval == 0) {
                for (let j = 0; j < ebullets; j++) {
                    // 発射していない弾がある場合は発射
                    if (e_bullets[i][j][2] == 0) {
                        // 弾の初期位置はプレイヤーと同じ位置にする
                        e_bullets[i][j][0] = e_info[i][0].x;
                        e_bullets[i][j][1] = e_info[i][1].y;
                        // 弾のHPを1にする
                        e_bullets[i][j][2] = 1;
                        ebulletInterval = 30;
                        break;
                    }
                }
            } else if (ebulletInterval > 0) {
                ebulletInterval--;
            }
        }
    }
    // プレイヤーの弾丸移動
    let movePlayerBullets = function() {
        // laser
        this.laserMove = () => {
            for (let i = 0; i < bullets; i++) {
                // hpが0以下の場合はスキップ
                if (p_bullets[i][2] <= 0) {
                    continue;
                } else {
                    p_bullets[i][1] += pbSpeed;
                }           
            }
        }
        // seeker
        this.seekerMove = () => {
            for (let i = 0; i < seekers; i++) {
                // hpが0以下の場合はスキップ
                if (p_seeker[i][2] <= 0) {
                    continue;
                } else {
                    p_seeker[i][1] += pbSpeed;
                }           
            }
        }
        // pulse
        this.pulseMove = () => {
            for (let i = 0; i < pulse; i++) {
                // hpが0以下の場合はスキップ
                if (p_pulse[i][2] <= 0) {
                    continue;
                } else {
                    p_pulse[i][1] += pbSpeed;
                }           
            }
        }
    }
    // 敵機の弾丸移動
    let moveEnemyBullets = function() {
        for (let i = 0; i < enemies; i++) {
            for (let j = 0; j < ebullets; j++) {
                // hpが0以下の場合はスキップ
                if (e_bullets[i][j][2] <= 0) {
                    continue;
                } else {
                    e_bullets[i][j][1] += ebSpeed;
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
    
    let checkCommon = function(pbullets_ar, ebullets_ar, amount, image) {
        // プレイヤー弾丸to敵機
        this.pbulletsToEnemy = ()=> {
            for (let i = 0; i < enemies; i++) {
                if (e_info[i][2].hp > 0) {
                    for (let j = 0; j < amount; j++) {
                        if (pbullets_ar[j][2] <= 0) {
                            continue;
                        }
                        if (collision(pbullets_ar[j][0], pbullets_ar[j][1], image,
                                            e_info[i][0].x, e_info[i][1].y, enemyImg)) {
                            pbullets_ar[j][2] -= 1;
                            e_info[i][2].hp -= 1;
                        }
                    }
                } 
            }  
        }
        // プレイヤー弾丸to敵弾丸
        this.pbulletsToEbullets = ()=> {
            for (let i = 0; i < enemies; i++) {
                for (let j = 0; j < ebullets; j++) {
                    if (p_info.hp > 0) {
                        for (let k = 0; k < amount; k++) {
                            if (ebullets_ar[i][j][2] <= 0 || pbullets_ar[k][2] <= 0) {
                                continue;
                            }
                            if (collision(ebullets_ar[i][j][0], ebullets_ar[i][j][1], enemybullet,
                                        pbullets_ar[k][0], pbullets_ar[k][1], image,)) {
                                ebullets_ar[i][j][2] -= 1;
                                pbullets_ar[k][2] -= 1;
                            }
                        }
                    }
                }
            }
        }
    }
    // 衝突判定
    let check = function() {
        // プレイヤーとの衝突判定は無敵時間の場合は除く   
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
            // プレイヤーと敵弾丸
            for (let i = 0; i < enemies; i++) {
                for (let j = 0; j < ebullets; j++) {
                    if (p_info.hp > 0) {
                        if (e_bullets[i][j][2] <= 0) {
                            continue;
                        }
                        if (collision(e_bullets[i][j][0], e_bullets[i][j][1], enemybullet,
                                        p_info.x, p_info.y, playerImg)) {
                            p_info.hp -= 1;
                            e_bullets[i][j][2] -= 1;
                            startInterval = initstarInterval;
                        }
                    }
                }
            }
        } else if (startInterval > 0) {
            startInterval--;
        }
        // プレイヤー弾丸（レーザー）と敵機
        new checkCommon(p_bullets, '', bullets, playerbullet).pbulletsToEnemy();
        // プレイヤーseekerと敵機
        new checkCommon(p_seeker, '', seekers, seekerImg).pbulletsToEnemy();
        // プレイヤーpulseと敵機
        new checkCommon(p_pulse, '', pulse, pulseImg).pbulletsToEnemy();
        // 敵弾丸とプレイヤー弾丸（レーザー）
        new checkCommon(p_bullets, e_bullets, bullets, playerbullet).pbulletsToEbullets();
        // 敵弾丸とプレイヤーseeker
        new checkCommon(p_seeker, e_bullets, seekers, seekerImg).pbulletsToEbullets();
        // 敵弾丸とプレイヤーpulse
        new checkCommon(p_pulse, e_bullets, pulse, pulseImg).pbulletsToEbullets();
    }

    // 一時停止（ポーズ）
    let pause = function() {
        clearTimeout(timeoutId);
        isPaused = true;
        pauseStart = Date.now();
    }
    // 時間計測
    let countTime = function() {
        ellapsedTime = new Date(Date.now() - loopStart);
        m = String(ellapsedTime.getMinutes()).padStart(2, "0");
        s = String(ellapsedTime.getSeconds()).padStart(2, "0");
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
    
        ctx.font = '24px sans serif';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#007';
        let text = '2D SHOOTING GAME';
        ctx.fillText(text, width/2-130, height/2, 500);
        // 上下キーで難易度選択
        // 下
        if (keys[key_codes.D] && !cleared && titleloopInterval == 0) {
            if (level == 1) {
                level = 2;
            } else if (level == 2) {
                level = 3;
            } else if (level == 3) {
                level = 1;
            }
            titleloopInterval = 7;
        // 下
        } else if (keys[key_codes.U] && !cleared && titleloopInterval == 0) {
            if (level == 1) {
                level = 3;
            } else if (level == 2) {
                level = 1;
            } else if (level == 3) {
                level = 2;
            }
            titleloopInterval = 7;
        }
        if (titleloopInterval > 0) {
            titleloopInterval--;
        }
        // メッセージの点滅 
        blinker++;
        if (blinker > 1) {
            ctx.globalAlpha = 0.5;
            if (blinker > 3) {
                blinker = 0;
            }
        }
        // 難易度選択ラベルの切り替え
        switch (level) {
            case 1:
                drawLabels('14px sans serif', '#070', '・NORMAL', width/2-40, height-140);
                break;
            case 2:
                drawLabels('14px sans serif', '#007', '・HARD', width/2-40, height-120);
                break;
            case 3:
                drawLabels('14px sans serif', '#e00', '・EXPERT', width/2-40, height-100);
                break;
        }
        ctx.globalAlpha = 1.0;
        if (level == 1) {
            drawLabels('14px sans serif', '#007', '・HARD', width/2-40, height-120);
            drawLabels('14px sans serif', '#e00', '・EXPERT', width/2-40, height-100);
        } else if (level == 2) {
            drawLabels('14px sans serif', '#070', '・NORMAL', width/2-40, height-140);
            drawLabels('14px sans serif', '#e00', '・EXPERT', width/2-40, height-100);
        } else if (level == 3) {
            drawLabels('14px sans serif', '#070', '・NORMAL', width/2-40, height-140);
            drawLabels('14px sans serif', '#007', '・HARD', width/2-40, height-120);
        }
        drawLabels('22px sans serif', '#f09', 'Press SPACE to start', width/2-100, height-60);
        drawLabels('16px sans serif', '#007', '※Press ENTER to pause', width/2-90, height-20);
        ctx.restore();

        // スペースキーが押されたらメインループスタート
        if (keys[key_codes.S] && !cleared) {
            mainloop();
            loopStart = Date.now();
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
        countTime();
        moveplayer();
        new movePlayerBullets().laserMove();
        new movePlayerBullets().seekerMove();
        new movePlayerBullets().pulseMove();
        moveEnemies();
        moveEnemyBullets();
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
        // クリア時にはループをストップ
        if (cleared) {
            clearTimeout(timeoutId);
            pauseStart = Date.now();
        }
        if (gameOver || completed) {
            clearTimeout(timeoutId);
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
        // ステージクリア毎の処理
        if (cleared && keys[key_codes.E]) {
            cleared = false;
            stage++;
            if (stage < 7) {
                eSpeed += 0.5;
                ebSpeed += 0.3;
            }
            fireInterval = initFireInterval;
            // 難易度ごとに敵数や弾数補充を変える
            switch (level) {
                // ノーマル
                case 1:
                    enemies += 3;
                    remainb += 4*enemies;
                    remainSeeker += enemies;
                    remainPulse += 2*enemies;
                    break;
                // ハード
                case 2:
                    enemies += 5;
                    remainb += 3*enemies;
                    remainSeeker += Math.round(enemies/level);
                    remainPulse += Math.round(2*enemies/level);
                    break;
                // エキスパート
                case 3:
                    enemies += 8;
                    remainb += 3*enemies;
                    remainSeeker += Math.round(enemies/level);
                    remainPulse += Math.round(2*enemies/level);
                    ebSpeed += 0.2;
                    break;
            }
            defineEnemies();
            defineEnemyBullets();
            playerBullets.laser(true);
            playerBullets.seeker();
            playerBullets.pulse();
            mainloop();
            loopStart += Date.now() - pauseStart;
        } else if (!isPaused && keys[key_codes.E]) {
            pause();
        // ポーズからの再開
        } else if (isPaused && keys[key_codes.E]) {
            // ポーズしていた時間を測定し、loopstartに加算する
            mainloop();
            loopStart += Date.now() - pauseStart;
            isPaused = false;
        }
        // リプレイ
        if (gameOver && keys[key_codes.E]) {
            window.location.reload();
        }
    }

});