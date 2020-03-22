'use strict';
{
    // 変数宣言
    const board = document.getElementById('board');
    const table = document.createElement('table');
    const comment = document.getElementById('comment');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let x;
    let y;
    let selectedPoint;
    // true:白の手番 false:黒の手番
    let next = true;

    /** 画像拾って充てるのは取り消し
    const black = document.createElement('img');
    black.src = 'images/blackpiece.png';
    black.classList.add('piece');
    const white = document.createElement('img');
    white.src = 'images/whitepiece.png';
    white.classList.add('piece');
    console.log(white);
    */

    // ロード時にボードを描画
    window.onload = 
    function displayBoard() {
        for (let x = 0; x < 8; x++) {
            tr = document.createElement('tr');
            table.appendChild(tr);
            for (let y = 0; y < 8; y++) {
                td = document.createElement('td');
                td.id = `${x}${y}`
                // 初期の白駒配置
                if ((x === 3 && y === 3) || (x === 4 && y === 4)) {
                    td.innerHTML = '●';
                    td.classList.add("white");
                }
                // 初期の黒駒配置
                if ((x === 3 && y === 4) || (x === 4 && y === 3)) {
                    td.innerHTML = '●';
                    td.classList.add("black");
                }
                // テスト用
                // if (x === 3 && y === 5 ) {
                //     td.innerHTML = '●';
                //     td.classList.add("black");
                // }

                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
        board.appendChild(table);

        comment.innerHTML = '白の手番です';
    }

    // クリックで対象マスへ駒を反映する
    table.addEventListener('click', event => {
        // クリックマスを処理用に変換
        x = String(event.target.id).substring(0, 1);
        y = String(event.target.id).substring(1);
        selectedPoint = x + y
        console.log(selectedPoint);

        // クリックされたマスを取得
        let td = document.getElementById(selectedPoint);
        
        /** 手番チェンジ */
        // 駒なしマスを格納
        let rlist = [];
        let llist = [];  
        let tlist = [];  
        let blist = []; 
        // 既に反転駒があるかどうか
        let changeable = false;
        // 反転ストップフラグ
        let stopInversion = false;
        // 白を置いたとき
        if (next) {
            // 既に駒が配置されているマスは変更不可
            if (td.classList.contains('white') || td.classList.contains('black')) {
                return;
            }
            
            // 右側の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(y)+1; i < 8; i++) {
                let r = x + String(i);
                let right = document.getElementById(r);
                try {
                    // 右側に白駒が配置されている場合
                    if (right.classList.contains('white')) {
                        // 右一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(y) + 1 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');
                            i = 8;
                        }
                        let rbtwn = Number(String(right.id).substring(1));
                        // 配置地点から右側のマスを全て取得
                        for (let j = Number(y)+1; j <= rbtwn; j++) {
                            let bt
                            x === 0 ? bt = '0' + String(j) : bt = String(x) + String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('black') && rlist.length === 0 && !stopInversion) {
                                btel.classList.remove('black');
                                btel.classList.add('white');
                                td.innerHTML = '●';
                                td.classList.add('white');
                                next = false;
                                comment.innerHTML = '黒の手番です';
                                changeable = true;
                            // 間に同色の駒が見つかったら以降は反転ストップ
                            } else if (btel.classList.contains('white')) {
                                stopInversion = true;
                            // 間に駒がない場合
                            } else if (!btel.classList.contains('black') && !btel.classList.contains('white')) {
                                rlist.push(btel);
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (rlist.length > 0 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
                            continue;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            stopInversion = false;
            // 左側の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(y)-1; i >= 0; i--) {
                let l = x + String(i);
                let left = document.getElementById(l);       
                try {
                    // 左側に一つでも白駒があれば間の駒を反転
                    if (left.classList.contains('white')) {
                        // 左一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(y) - 1 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');
                            i = -1;
                        }
                        let lbtwn = Number(String(left.id).substring(1));
                        // 配置地点から左側のマスを全て取得
                        for (let j = Number(y)-1; j >= lbtwn; j--) {
                            let bt
                            x === 0 ? bt = '0' + String(j) : bt = String(x) + String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('black') && llist.length === 0 && !stopInversion) {
                                btel.classList.remove('black');
                                btel.classList.add('white');
                                td.innerHTML = '●';
                                td.classList.add('white');
                                next = false;
                                comment.innerHTML = '黒の手番です';
                                changeable = true;
                            // 間に同色の駒が見つかったら以降は反転ストップ
                            } else if (btel.classList.contains('white')) {
                                stopInversion = true;
                            // 間に駒がない場合
                            } else if (!btel.classList.contains('black') && !btel.classList.contains('white')) {
                                llist.push(btel);
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (llist.length > 0 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
                            continue;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            stopInversion = false;
            // 上側の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(x)-1; i >= 0; i--) {
                let t = String(i) + y;
                let top = document.getElementById(t);       
                try {
                    // 上側に一つでも白駒があれば間の駒を反転
                    if (top.classList.contains('white')) {
                        // 上一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(x) - 1 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');
                            i = -1;
                        }
                        let tbtwn = Number(String(top.id).substring(0, 1));
                        // 配置地点から上側のマスを全て取得
                        for (let j = Number(x)-1; j >= tbtwn; j--) {
                            let bt
                            j === 0 ? bt = '0' + y : bt = String(j) + y;
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('black') && tlist.length === 0 && !stopInversion) {
                                btel.classList.remove('black');
                                btel.classList.add('white');
                                td.innerHTML = '●';
                                td.classList.add('white');
                                next = false;
                                comment.innerHTML = '黒の手番です';
                                changeable = true;
                            // 間に同色の駒が見つかったら以降は反転ストップ
                            } else if (btel.classList.contains('white')) {
                                stopInversion = true;
                            // 間に駒がない場合
                            } else  if (!btel.classList.contains('black') && !btel.classList.contains('white')){
                                tlist.push(btel);
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (tlist.length > 0 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
                            continue;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            stopInversion = false;
            // 下側の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(x)+1; i < 8; i++) {
                let b = String(i) + y;
                let bottom = document.getElementById(b);       
                try {
                    // 下側に一つでも白駒があれば間の駒を反転
                    if (bottom.classList.contains('white')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(x) + 1 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');
                            i = 8;
                        }
                        let bbtwn = Number(String(bottom.id).substring(0, 1));
                        // 配置地点から上側のマスを全て取得
                        for (let j = Number(x)+1; j <= bbtwn; j++) {
                            let bt
                            j === 0 ? bt = '0' + y : bt = String(j) + y;
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('black') && blist.length === 0 && !stopInversion) {
                                btel.classList.remove('black');
                                btel.classList.add('white');
                                td.innerHTML = '●';
                                td.classList.add('white');
                                next = false;
                                comment.innerHTML = '黒の手番です';
                                changeable = true;
                            // 間に同色の駒が見つかったら以降は反転ストップ
                            } else if (btel.classList.contains('white')) {
                                stopInversion = true;
                            // 間に駒がない場合
                            } else if (!btel.classList.contains('black') && !btel.classList.contains('white')) {
                                blist.push(btel);
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (blist.length > 0 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
                            continue;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            stopInversion = false;
        // 黒を置いたとき
        } else {
            // 既に駒が配置されているマスは変更不可
            if (td.classList.contains('white') || td.classList.contains('black')) {
                return;
            }
            // 右側の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(y)+1; i < 8; i++) {
                let r = x + String(i);
                let right = document.getElementById(r);
                try {
                    // 右側に白駒が配置されている場合
                    if (right.classList.contains('black')) {
                        // 右一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(y) + 1 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');
                            i = 8;
                        }
                        let rbtwn = Number(String(right.id).substring(1));
                        // 配置地点から右側のマスを全て取得
                        for (let j = Number(y)+1; j <= rbtwn; j++) {
                            let bt
                            x === 0 ? bt = '0' + String(j) : bt = String(x) + String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('white') && rlist.length === 0 && !stopInversion) {
                                btel.classList.remove('white');
                                btel.classList.add('black');
                                td.innerHTML = '●';
                                td.classList.add('black');
                                next = true;
                                comment.innerHTML = '白の手番です';
                                changeable = true;
                            // 間に同色の駒が見つかったら以降は反転ストップ
                            } else if (btel.classList.contains('black')) {
                                stopInversion = true;
                            // 間に駒がない場合
                            } else if (!btel.classList.contains('black') && !btel.classList.contains('white')) {
                                rlist.push(btel);
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (rlist.length > 0 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
                            continue;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            stopInversion = false;
            // 左側の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(y)-1; i >= 0; i--) {
                let l = x + String(i);
                let left = document.getElementById(l);       
                try {
                    // 左側に一つでも白駒があれば間の駒を反転
                    if (left.classList.contains('black')) {
                        // 左一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(y) - 1 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');
                            i = -1;
                        }
                        let lbtwn = Number(String(left.id).substring(1));
                        // 配置地点から左側のマスを全て取得
                        for (let j = Number(y)-1; j >= lbtwn; j--) {
                            let bt
                            x === 0 ? bt = '0' + String(j) : bt = String(x) + String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('white') && llist.length === 0 && !stopInversion) {
                                btel.classList.remove('white');
                                btel.classList.add('black');
                                td.innerHTML = '●';
                                td.classList.add('black');
                                next = true;
                                comment.innerHTML = '白の手番です';
                                changeable = true;
                            // 間に同色の駒が見つかったら以降は反転ストップ
                            } else if (btel.classList.contains('black')) {
                                stopInversion = true;
                            // 間に駒がない場合
                            } else if (!btel.classList.contains('black') && !btel.classList.contains('white')) {
                                llist.push(btel);
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (llist.length > 0 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
                            continue;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            stopInversion = false;
            // 上側の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(x)-1; i >= 0; i--) {
                let t = String(i) + y;
                let top = document.getElementById(t);       
                try {
                    // 上側に一つでも白駒があれば間の駒を反転
                    if (top.classList.contains('black')) {
                        // 上一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(x) - 1 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');
                            i = -1;
                        }
                        let tbtwn = Number(String(top.id).substring(0, 1));
                        // 配置地点から上側のマスを全て取得
                        for (let j = Number(x)-1; j >= tbtwn; j--) {
                            let bt
                            j === 0 ? bt = '0' + y : bt = String(j) + y;
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('white') && tlist.length === 0 && !stopInversion) {
                                btel.classList.remove('white');
                                btel.classList.add('black');
                                td.innerHTML = '●';
                                td.classList.add('black');
                                next = true;
                                comment.innerHTML = '白の手番です';
                                changeable = true;
                            // 間に同色の駒が見つかったら以降は反転ストップ
                            } else if (btel.classList.contains('black')) {
                                stopInversion = true;
                            // 間に駒がない場合
                            } else  if (!btel.classList.contains('black') && !btel.classList.contains('white')){
                                tlist.push(btel);
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (tlist.length > 0 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
                            continue;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            stopInversion = false;
            // 下側の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(x)+1; i < 8; i++) {
                let b = String(i) + y;
                let bottom = document.getElementById(b);       
                try {
                    // 下側に一つでも白駒があれば間の駒を反転
                    if (bottom.classList.contains('black')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(x) + 1 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');
                            i = 8;
                        }
                        let bbtwn = Number(String(bottom.id).substring(0, 1));
                        // 配置地点から上側のマスを全て取得
                        for (let j = Number(x)+1; j <= bbtwn; j++) {
                            let bt
                            j === 0 ? bt = '0' + y : bt = String(j) + y;
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('white') && blist.length === 0 && !stopInversion) {
                                btel.classList.remove('white');
                                btel.classList.add('black');
                                td.innerHTML = '●';
                                td.classList.add('black');
                                next = true;
                                comment.innerHTML = '白の手番です';
                                changeable = true;
                            // 間に同色の駒が見つかったら以降は反転ストップ
                            } else if (btel.classList.contains('black')) {
                                stopInversion = true;
                            // 間に駒がない場合
                            } else if (!btel.classList.contains('black') && !btel.classList.contains('white')) {
                                blist.push(btel);
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (blist.length > 0 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
                            continue;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }

    });


}