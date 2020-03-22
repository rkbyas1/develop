'use strict';
{
    // 変数宣言
    const boards = document.getElementById('boards');
    const spin = document.getElementById('spin');
    const stop = document.getElementById('stop');
    const blk1 = document.getElementById('blk1');
    const blk2 = document.getElementById('blk2');
    const drum = document.getElementById('drum');
    drum.volume = 0.05;
    const cymbal = document.getElementById('cymbal');
    cymbal.volume = 0.1;
    let tblNum;
    let dispNum;
    let panels = [];
    let deletedList = [];
    let spinFlg = false;
    let timeoutId = '';
    let finFlg = false;
    let spinStart;

    // ロード時75枚パネルを描画
    window.onload = function createBoards() {
        // テーブル要素を先に作っておく
        let table = document.createElement('table');
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
        console.log(panels);
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
        tblNum = document.getElementsByClassName('tdata');
        dispNum = blk1.innerHTML + blk2.innerHTML;

        for (const num of tblNum) {
            // パネル表示の一致判定
            if (num.innerHTML === dispNum) {
                // 選択されたらデザインを切り替え
                if (!num.classList.contains('selected')) {
                    num.classList.add('selected');
                    // 選択された配列要素を削除リストへ移動
                    deletedList.push(dispNum);
                    console.log(deletedList);
                    // 選択された配列要素を削除
                    panels.splice(panels.indexOf(dispNum), 1);
                }
            }
        }
        // 全て選択されたらspin出来ないようフラグ更新
        panels.length <= 1 ? finFlg = true : 
        console.log(panels);
    }

    // SPINボタン押下でパネルにランダム数値を表示
    spin.addEventListener('click', () => {
        if (!spinFlg) {
            spinStart = Date.now();
            spinPanel();
            drum.currentTime = 0;
            drum.play();
        }       
    });

    // SPIN停止
    function stopProcedure() {
        clearTimeout(timeoutId);     
        stopPanel();
        drum.pause();
        if (spinFlg) {
            cymbal.currentTime = 0;
            cymbal.play();
        }
        spinFlg = false;
    }

    // STOPボタン押下
    stop.addEventListener('click', () => {
        stopProcedure();
    });

}
