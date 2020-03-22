'use strict';
{
    /** 変数宣言 */
    const board = document.getElementById('board');
    const table = document.createElement('table');
    const comment = document.getElementById('comment');
    const points = document.getElementById('points');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let x;
    let y;
    let selectedPoint;
    // 既に反転駒があるかどうか
    let changeable = false;
    // 反転ストップフラグ
    let stopInversion = false;
    // true:白の手番 false:黒の手番
    let next;
    // 駒色指定用
    let stoneColor = ["white", "black"];
    

    /** ロード時にボードを描画 */ 
    window.onload = 
    function displayBoard() {
        for (let x = 0; x < 8; x++) {
            tr = document.createElement('tr');
            table.appendChild(tr);
            for (let y = 0; y < 8; y++) {
                td = document.createElement('td');
                td.id = `${x}${y}`;
                // 中央への初期駒配置は白黒ランダムで
                let rand = Math.floor(Math.random() * 2);
                if (td.id === '33') {
                    td.innerHTML = '●';
                    td.classList.add(stoneColor[rand]);
                    stoneColor.splice(stoneColor.indexOf(stoneColor[rand]), 1); 
                } else if (td.id === '34') {
                    td.innerHTML = '●';
                    td.classList.add(stoneColor[0]);
                } else if (td.id === '43') {
                    td.innerHTML = '●';
                    td.classList.add(stoneColor[0]);
                } else if (td.id === '44') {
                    td.innerHTML = '●';
                    stoneColor[0] === 'black' ? td.classList.add('white') : td.classList.add('black');
                }
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
        board.appendChild(table);

        if (stoneColor[0] === 'black') {
            comment.innerHTML = '白の手番です';
            next = true;
        } else {
            comment.innerHTML = '黒の手番です';
            next = false;
        }

        // stoneColor配列の初期化
        stoneColor = ["white", "black"];  
    }

    /** 手番チェンジ（スキップ） */
    const change = document.getElementById('change');
    change.addEventListener('click', () => {
        if (next) {
            next = false;
            comment.innerHTML = '黒の手番です';
        } else {
            next = true;
            comment.innerHTML = '白の手番です'; 
        }
    });

    // 右側の全ての駒を取得しながら駒の有無を判定
    function InvertRight(putColor, reverseColor, td, turncomment, turnFlg) {
        for (let i = Number(y)+1; i < 8; i++) {
            let r = x + String(i);
            let right = document.getElementById(r);
            try {
                // 右側に白駒が配置されている場合
                if (right.classList.contains(putColor)) {
                    // 右一つ隣が白の場合は処理せずにループを抜ける
                    if (i === Number(y) + 1 && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);
                        i = 8;
                    }
                    let rbtwn = Number(String(right.id).substring(1));
                    // 配置地点から右側のマスを全て取得
                    for (let j = Number(y)+1; j <= rbtwn; j++) {
                        let bt
                        x === 0 ? bt = '0' + String(j) : bt = String(x) + String(j);
                        let btel = document.getElementById(bt);
                        // 間に駒がある場合は反転
                        if (btel.classList.contains(reverseColor) && !stopInversion) {
                            btel.classList.remove(reverseColor);
                            btel.classList.add(putColor);
                            td.innerHTML = '●';
                            td.classList.add(putColor);
                            next = turnFlg;
                            comment.innerHTML = turncomment;
                            changeable = true;
                        // 間に同色の駒が見つかったら以降は反転ストップ
                        } else if (btel.classList.contains(putColor)) {
                            stopInversion = true;
                        } 
                    }
                    // 間に駒なしマスがある場合は反転不可
                    if (stopInversion && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);  
                        continue;
                    }
                // 駒なしマスがある場合は反転不可フラグを立てる
                } else if (!right.classList.contains('black') && !right.classList.contains('white')) {
                    stopInversion = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        stopInversion = false;
    }

    // 左側の全ての駒を取得しながら駒の有無を判定
    function InvertLeft(putColor, reverseColor, td, turncomment, turnFlg) {
        for (let i = Number(y)-1; i >= 0; i--) {
            let l = x + String(i);
            let left = document.getElementById(l);       
            try {
                // 左側に一つでも白駒があれば間の駒を反転
                if (left.classList.contains(putColor)) {
                    // 左一つ隣が白の場合は処理せずにループを抜ける
                    if (i === Number(y) - 1 && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);
                        i = -1;
                    }
                    let lbtwn = Number(String(left.id).substring(1));
                    // 配置地点から左側のマスを全て取得
                    for (let j = Number(y)-1; j >= lbtwn; j--) {
                        let bt
                        x === 0 ? bt = '0' + String(j) : bt = String(x) + String(j);
                        let btel = document.getElementById(bt);
                        // 間に駒がある場合は反転
                        if (btel.classList.contains(reverseColor) && !stopInversion) {
                            btel.classList.remove(reverseColor);
                            btel.classList.add(putColor);
                            td.innerHTML = '●';
                            td.classList.add(putColor);
                            next = turnFlg;
                            comment.innerHTML = turncomment;
                            changeable = true;
                        // 間に同色の駒が見つかったら以降は反転ストップ
                        } else if (btel.classList.contains(putColor)) {
                            stopInversion = true;
                        }
                    }
                    // 間に駒なしマスがある場合は反転不可
                    if (stopInversion && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);  
                        continue;
                    }
                // 駒なしマスがある場合は反転不可フラグを立てる
                } else if (!left.classList.contains('black') && !left.classList.contains('white')) {
                    stopInversion = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        stopInversion = false;
    }

    // 上側の全ての駒を取得しながら駒の有無を判定
    function InvertTop(putColor, reverseColor, td, turncomment, turnFlg) {
        for (let i = Number(x)-1; i >= 0; i--) {
            let t = String(i) + y;
            let top = document.getElementById(t);       
            try {
                // 上側に一つでも白駒があれば間の駒を反転
                if (top.classList.contains(putColor)) {
                    // 上一つ隣が白の場合は処理せずにループを抜ける
                    if (i === Number(x) - 1 && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);
                        i = -1;
                    }
                    let tbtwn = Number(String(top.id).substring(0, 1));
                    // 配置地点から上側のマスを全て取得
                    for (let j = Number(x)-1; j >= tbtwn; j--) {
                        let bt
                        j === 0 ? bt = '0' + y : bt = String(j) + y;
                        let btel = document.getElementById(bt);
                        // 間に駒がある場合は反転
                        if (btel.classList.contains(reverseColor) && !stopInversion) {
                            btel.classList.remove(reverseColor);
                            btel.classList.add(putColor);
                            td.innerHTML = '●';
                            td.classList.add(putColor);
                            next = turnFlg;
                            comment.innerHTML = turncomment;
                            changeable = true;
                        // 間に同色の駒が見つかったら以降は反転ストップ
                        } else if (btel.classList.contains(putColor)) {
                            stopInversion = true;
                        }
                    }
                    // 間に駒なしマスがある場合は反転不可
                    if (stopInversion && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);  
                        continue;
                    }
                // 駒なしマスがある場合は反転不可フラグを立てる
                } else if (!top.classList.contains('black') && !top.classList.contains('white')) {
                    stopInversion = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        stopInversion = false;
    }

    // 下側の全ての駒を取得しながら駒の有無を判定
    function InvertBottom(putColor, reverseColor, td, turncomment, turnFlg) {
        for (let i = Number(x)+1; i < 8; i++) {
            let b = String(i) + y;
            let bottom = document.getElementById(b);       
            try {
                // 下側に一つでも白駒があれば間の駒を反転
                if (bottom.classList.contains(putColor)) {
                    // 下一つ隣が白の場合は処理せずにループを抜ける
                    if (i === Number(x) + 1 && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);
                        i = 8;
                    }
                    let bbtwn = Number(String(bottom.id).substring(0, 1));
                    // 配置地点から上側のマスを全て取得
                    for (let j = Number(x)+1; j <= bbtwn; j++) {
                        let bt
                        j === 0 ? bt = '0' + y : bt = String(j) + y;
                        let btel = document.getElementById(bt);
                        // 間に駒がある場合は反転
                        if (btel.classList.contains(reverseColor) && !stopInversion) {
                            btel.classList.remove(reverseColor);
                            btel.classList.add(putColor);
                            td.innerHTML = '●';
                            td.classList.add(putColor);
                            next = turnFlg;
                            comment.innerHTML = turncomment;
                            changeable = true;
                        // 間に同色の駒が見つかったら以降は反転ストップ
                        } else if (btel.classList.contains(putColor)) {
                            stopInversion = true;
                        }
                    }
                    // 間に駒なしマスがある場合は反転不可
                    if (stopInversion && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);  
                        continue;
                    }
                // 駒なしマスがある場合は反転不可フラグを立てる
                } else if (!bottom.classList.contains('black') && !bottom.classList.contains('white')) {
                    stopInversion = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        stopInversion = false;
    }

    // 右下の全ての駒を取得しながら駒の有無を判定
    function InvertRightBottom(putColor, reverseColor, td, turncomment, turnFlg) {
        for (let i = Number(selectedPoint)+11; i < 78; i+=11) {
            let rb = String(i);
            if(Number(rb.substring(1)) > 7 || Number(rb.substring(0, 1)) > 7) {
                continue;
            } 
            let rbottom = document.getElementById(rb);       
            try {
                // 一つでも白駒があれば間の駒を反転
                if (rbottom.classList.contains(putColor)) {
                    // 下一つ隣が白の場合は処理せずにループを抜ける
                    if (i === Number(selectedPoint)+11 && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);
                        i = 78;
                    }
                    let rbbtwn = Number(String(rbottom.id));
                    // 配置地点から同色マスまでを全て取得
                    for (let j = Number(selectedPoint)+11; j <= rbbtwn; j+=11) {
                        let bt = String(j);
                        let btel = document.getElementById(bt);
                        // 間に駒がある場合は反転
                        if (btel.classList.contains(reverseColor) && !stopInversion) {
                            btel.classList.remove(reverseColor);
                            btel.classList.add(putColor);
                            td.innerHTML = '●';
                            td.classList.add(putColor);
                            next = turnFlg;
                            comment.innerHTML = turncomment;
                            changeable = true;
                        // 間に同色の駒が見つかったら以降は反転ストップ
                        } else if (btel.classList.contains(putColor)) {
                            stopInversion = true;
                        }
                    }
                    // 間に駒なしマスがある場合は反転不可
                    if (stopInversion && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);  
                        continue;
                    }
                // 駒なしマスがある場合は反転不可フラグを立てる
                } else if (!rbottom.classList.contains('black') && !rbottom.classList.contains('white')) {
                    stopInversion = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        stopInversion = false;
    }

    // 左下の全ての駒を取得しながら駒の有無を判定
    function InvertLeftBottom(putColor, reverseColor, td, turncomment, turnFlg) {
        for (let i = Number(selectedPoint)+9; i < 76; i+=9) {
            let lb = String(i);
            if(Number(lb.substring(1)) < 0 || Number(lb.substring(0, 1)) > 7) {
                continue;
            } 
            let lbottom = document.getElementById(lb);       
            try {
                // 一つでも白駒があれば間の駒を反転
                if (lbottom.classList.contains(putColor)) {
                    // 下一つ隣が白の場合は処理せずにループを抜ける
                    if (i === Number(selectedPoint)+9 && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);
                        i = 76;
                    }
                    let lbbtwn = Number(String(lbottom.id));
                    // 配置地点から同色マスまでを全て取得
                    for (let j = Number(selectedPoint)+9; j <= lbbtwn; j+=9) {
                        let bt = String(j);
                        let btel = document.getElementById(bt);
                        // 間に駒がある場合は反転
                        if (btel.classList.contains(reverseColor) && !stopInversion) {
                            btel.classList.remove(reverseColor);
                            btel.classList.add(putColor);
                            td.innerHTML = '●';
                            td.classList.add(putColor);
                            next = turnFlg;
                            comment.innerHTML = turncomment;
                            changeable = true;
                        // 間に同色の駒が見つかったら以降は反転ストップ
                        } else if (btel.classList.contains(putColor)) {
                            stopInversion = true;
                        }
                    }
                    // 間に駒なしマスがある場合は反転不可
                    if (stopInversion && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);  
                        continue;
                    }
                // 駒なしマスがある場合は反転不可フラグを立てる
                } else if (!lbottom.classList.contains('black') && !lbottom.classList.contains('white')) {
                    stopInversion = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        stopInversion = false;
    }

    // 右上の全ての駒を取得しながら駒の有無を判定
    function InvertRightTop(putColor, reverseColor, td, turncomment, turnFlg) {
        for (let i = Number(selectedPoint)-9; i > 11; i-=9) {
            let rt = String(i);
            if(Number(rt.substring(1)) > 7 || Number(rt.substring(0, 1)) < 0) {
                continue;
            } 
            let rtop = document.getElementById(rt);       
            try {
                // 一つでも白駒があれば間の駒を反転
                if (rtop.classList.contains(putColor)) {
                    // 下一つ隣が白の場合は処理せずにループを抜ける
                    if (i === Number(selectedPoint)-9 && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);
                        i = 11;
                    }
                    let rtbtwn = Number(String(rtop.id));
                    // 配置地点から同色マスまでを全て取得
                    for (let j = Number(selectedPoint)-9; j >= rtbtwn; j-=9) {
                        let bt = String(j);
                        let btel = document.getElementById(bt);
                        // 間に駒がある場合は反転
                        if (btel.classList.contains(reverseColor) && !stopInversion) {
                            btel.classList.remove(reverseColor);
                            btel.classList.add(putColor);
                            td.innerHTML = '●';
                            td.classList.add(putColor);
                            next = turnFlg;
                            comment.innerHTML = turncomment;
                            changeable = true;
                        // 間に同色の駒が見つかったら以降は反転ストップ
                        } else if (btel.classList.contains(putColor)) {
                            stopInversion = true;
                        }
                    }
                    // 間に駒なしマスがある場合は反転不可
                    if (stopInversion && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);  
                        continue;
                    }
                // 駒なしマスがある場合は反転不可フラグを立てる
                } else if (!rtop.classList.contains('black') && !rtop.classList.contains('white')) {
                    stopInversion = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        stopInversion = false;
    }

    // 左上の全ての駒を取得しながら駒の有無を判定
    function InvertLeftTop(putColor, reverseColor, td, turncomment, turnFlg) {
        for (let i = Number(selectedPoint)-11; i > 11; i-=11) {
            let lt = String(i);
            if(Number(lt.substring(1)) < 0 || Number(lt.substring(0, 1)) < 0) {
                continue;
            } 
            let ltop = document.getElementById(lt);       
            try {
                // 一つでも白駒があれば間の駒を反転
                if (ltop.classList.contains(putColor)) {
                    // 下一つ隣が白の場合は処理せずにループを抜ける
                    if (i === Number(selectedPoint)-11 && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);
                        i = 11;
                    }
                    let ltbtwn = Number(String(ltop.id));
                    // 配置地点から同色マスまでを全て取得
                    for (let j = Number(selectedPoint)-11; j >= ltbtwn; j-=11) {
                        let bt = String(j);
                        let btel = document.getElementById(bt);
                        // 間に駒がある場合は反転
                        if (btel.classList.contains(reverseColor) && !stopInversion) {
                            btel.classList.remove(reverseColor);
                            btel.classList.add(putColor);
                            td.innerHTML = '●';
                            td.classList.add(putColor);
                            next = turnFlg;
                            comment.innerHTML = turncomment;
                            changeable = true;
                        // 間に同色の駒が見つかったら以降は反転ストップ
                        } else if (btel.classList.contains(putColor)) {
                            stopInversion = true;
                        }
                    }
                    // 間に駒なしマスがある場合は反転不可
                    if (stopInversion && !changeable) {
                        td.innerHTML = '';
                        td.classList.remove(putColor);  
                        continue;
                    }
                // 駒なしマスがある場合は反転不可フラグを立てる
                } else if (!ltop.classList.contains('black') && !ltop.classList.contains('white')) {
                    stopInversion = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
        stopInversion = false;
    }

    /** クリックで駒を反転する */
    table.addEventListener('click', event => {
        // カウント用
        let whiteStone = 0;
        let blackStone = 0;
        // クリックマスを処理用に変換
        x = String(event.target.id).substring(0, 1);
        y = String(event.target.id).substring(1);
        selectedPoint = x + y
        console.log(selectedPoint);

        // クリックされたマスを取得
        let td = document.getElementById(selectedPoint);

        /** 手番チェンジ */
        // 白を置いたとき
        if (next) {
            // 既に駒が配置されているマスは変更不可
            if (td.classList.contains('white') || td.classList.contains('black')) {
                return;
            }
            InvertRight(stoneColor[0], stoneColor[1], td, '黒の手番です', false);
            InvertLeft(stoneColor[0], stoneColor[1], td, '黒の手番です', false);
            InvertTop(stoneColor[0], stoneColor[1], td, '黒の手番です', false);
            InvertBottom(stoneColor[0], stoneColor[1], td, '黒の手番です', false);
            InvertRightBottom(stoneColor[0], stoneColor[1], td, '黒の手番です', false);
            InvertLeftBottom(stoneColor[0], stoneColor[1], td, '黒の手番です', false);
            InvertRightTop(stoneColor[0], stoneColor[1], td, '黒の手番です', false);
            InvertLeftTop(stoneColor[0], stoneColor[1], td, '黒の手番です', false);
            
        // 黒を置いたとき
        } else {
            // 既に駒が配置されているマスは変更不可
            if (td.classList.contains('white') || td.classList.contains('black')) {
                return;
            }
            InvertRight(stoneColor[1], stoneColor[0], td, '白の手番です', true);
            InvertLeft(stoneColor[1], stoneColor[0], td, '白の手番です', true);
            InvertTop(stoneColor[1], stoneColor[0], td, '白の手番です', true);
            InvertBottom(stoneColor[1], stoneColor[0], td, '白の手番です', true);
            InvertRightBottom(stoneColor[1], stoneColor[0], td, '白の手番です', true);
            InvertLeftBottom(stoneColor[1], stoneColor[0], td, '白の手番です', true);
            InvertRightTop(stoneColor[1], stoneColor[0], td, '白の手番です', true);
            InvertLeftTop(stoneColor[1], stoneColor[0], td, '白の手番です', true);       
        }

        /** 盤上の駒数をカウント*/
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let id = String(`${i}${j}`);
                let panel = document.getElementById(id);

                if (panel.classList.contains('white')) {
                    whiteStone++;
                } else if (panel.classList.contains('black')) {
                    blackStone++;
                } else {
                    continue;
                }
            }
        }
        console.log(whiteStone);
        console.log(blackStone);
    });


}