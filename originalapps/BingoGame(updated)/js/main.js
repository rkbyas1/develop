(function () {
    'use strict';

    // 変数宣言
    const spin = document.getElementById('spin');
    spin.classList.add('spin');
    const blk1 = document.getElementById('blk1');
    const blk2 = document.getElementById('blk2');
    const drum = document.getElementById('drum');
    drum.volume = 0.05;
    const cymbal = document.getElementById('cymbal');
    cymbal.volume = 0.1;
    let panels = [];
    let deletedList = [];
    let spinFlg = false;
    let timeoutId = '';
    let finFlg = false;
    let spinStart;

    // ロード時75枚パネルを描画
    window.onload = function createBoards() {
        const boards = document.getElementById('boards');
        // テーブル要素を作成
        const table = document.createElement('table');
        let tblRecds = '<tr>';
        for (let i = 0; i < 76; i++) {
            if (i === 0) {
                panels.push(`0${i}`);
            } else if (i < 10){
                tblRecds += `<td class="tdata">0${i}</td>`;
                panels.push(`0${i}`);
            } else {
                tblRecds += `<td class="tdata">${i}</td>`;
                if (i % 15 === 0) {
                    tblRecds += '</tr><tr>';
                }
                panels.push(String(i));
            }
        }
        // console.log(panels);
        // テーブル要素への適用
        table.innerHTML = tblRecds;
        boards.appendChild(table);
    }

    // 一定時間ごとにSPINする関数
    function spinPanel() {
        // 全て選択された状態でなければspinする
        if (!finFlg) {
            // 01～75までをランダムに表示
            let ranNum = panels[Math.floor(Math.random() * (75 - deletedList.length)) + 1];
            // 十の位
            let ran10 = String(ranNum).substring(0, 1);
            // 一の位
            let ran01 = String(ranNum).substring(1);
            blk1.innerHTML = ran10;
            blk2.innerHTML = ran01;

            let dif = Date.now() - spinStart;
            // 5秒程度で自動的に停止
            if (dif > 4000 && dif < 4050) {
                stopProcedure();
            } else {
                timeoutId = setTimeout(() => {
                    spinPanel(); 
                }, 30); 
                spinFlg = true;
            }
        }
    }

    // STOP時に実行
    function stopPanel() {
        const tblNum = document.getElementsByClassName('tdata');
        const dispNum = blk1.innerHTML + blk2.innerHTML;

        for (const num of tblNum) {
            // パネル表示の一致判定
            if (num.innerHTML === dispNum) {
                // 選択されたらデザインを切り替え
                if (!num.classList.contains('selected')) {
                    num.classList.add('selected');
                    // 選択された配列要素を削除リストへ移動
                    deletedList.push(dispNum);
                    // 選択された配列要素を削除
                    panels.splice(panels.indexOf(dispNum), 1);
                }
            }
        }
        // 全て選択されたらspin出来ないようフラグ更新
        if (panels.length <= 1) {
            finFlg = true
        }
        // console.log(panels);
    }

    // SPIN開始
    function start() {
        spin.classList.remove('spin');
        spin.classList.add('stop');
        spin.innerHTML = 'STOP';
    }

    // SPINストップ
    function stop() {
        spin.classList.remove('stop');
        spin.classList.add('spin');
        spin.innerHTML = 'SPIN';
    }

    // ボタン押下処理
    function spinAndStop() {
        if (!spinFlg) {
            spinStart = Date.now();
            spinPanel();
            drum.currentTime = 0;
            drum.play();
            start();
        } else {
            stopProcedure();
        }  
    }

    // SPINボタン押下でパネルにランダム数値を表示
    spin.addEventListener('click', () => {
        spinAndStop();
    });

    // キーボード操作
    document.addEventListener('keydown', e => {
        if (e.keyCode == 13) {
            spinAndStop();
        }
    });

    // SPIN停止
    function stopProcedure() {
        clearTimeout(timeoutId);     
        stopPanel();
        stop();
        drum.pause();
        if (spinFlg) {
            cymbal.currentTime = 0;
            cymbal.play();
        }
        spinFlg = false;
    }

} ());
