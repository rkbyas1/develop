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
    let next;
    const init = ["white", "black"];

    /** ロード時にボードを描画 */ 
    window.onload = 
    function displayBoard() {
        for (let x = 0; x < 8; x++) {
            tr = document.createElement('tr');
            table.appendChild(tr);
            for (let y = 0; y < 8; y++) {
                td = document.createElement('td');
                td.id = `${x}${y}`;
                // 初期駒配置は白黒ランダムで
                let rand = Math.floor(Math.random() * 2);
                if (td.id === '33') {
                    td.innerHTML = '●';
                    td.classList.add(init[rand]);
                    init.splice(init.indexOf(init[rand]), 1); 
                } else if (td.id === '34') {
                    td.innerHTML = '●';
                    td.classList.add(init[0]);
                } else if (td.id === '43') {
                    td.innerHTML = '●';
                    td.classList.add(init[0]);
                } else if (td.id === '44') {
                    td.innerHTML = '●';
                    init[0] === 'black' ? td.classList.add('white') : td.classList.add('black');
                }
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
        board.appendChild(table);

        if (init[0] === 'black') {
            comment.innerHTML = '白の手番です';
            next = true;
        } else {
            comment.innerHTML = '黒の手番です';
            next = false;
        }
        
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

    /** クリックで駒を反転する */
    table.addEventListener('click', event => {
        // クリックマスを処理用に変換
        x = String(event.target.id).substring(0, 1);
        y = String(event.target.id).substring(1);
        selectedPoint = x + y
        console.log(selectedPoint);

        // クリックされたマスを取得
        let td = document.getElementById(selectedPoint);
        // 既に反転駒があるかどうか
        let changeable = false;
        // 反転ストップフラグ
        let stopInversion = false;

        /** 手番チェンジ */
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
                            if (btel.classList.contains('black') && !stopInversion) {
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
                            } 
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
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
                            if (btel.classList.contains('black') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
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
                            if (btel.classList.contains('black') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
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
                            if (btel.classList.contains('black') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
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

            // 右下の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(selectedPoint)+11; i < 78; i+=11) {
                let rb = String(i);
                if(Number(rb.substring(1)) > 7 || Number(rb.substring(0, 1)) > 7) {
                    continue;
                } 
                let rbottom = document.getElementById(rb);       
                try {
                    // 一つでも白駒があれば間の駒を反転
                    if (rbottom.classList.contains('white')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(selectedPoint)+11 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');
                            i = 78;
                        }
                        let rbbtwn = Number(String(rbottom.id));
                        // 配置地点から同色マスまでを全て取得
                        for (let j = Number(selectedPoint)+11; j <= rbbtwn; j+=11) {
                            let bt = String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('black') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
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
            
            // 左下の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(selectedPoint)+9; i < 76; i+=9) {
                let lb = String(i);
                if(Number(lb.substring(1)) < 0 || Number(lb.substring(0, 1)) > 7) {
                    continue;
                } 
                let lbottom = document.getElementById(lb);       
                try {
                    // 一つでも白駒があれば間の駒を反転
                    if (lbottom.classList.contains('white')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(selectedPoint)+9 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');
                            i = 76;
                        }
                        let lbbtwn = Number(String(lbottom.id));
                        // 配置地点から同色マスまでを全て取得
                        for (let j = Number(selectedPoint)+9; j <= lbbtwn; j+=9) {
                            let bt = String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('black') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
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
            
            // 右上の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(selectedPoint)-9; i > 11; i-=9) {
                let rt = String(i);
                if(Number(rt.substring(1)) > 7 || Number(rt.substring(0, 1)) < 0) {
                    continue;
                } 
                let rtop = document.getElementById(rt);       
                try {
                    // 一つでも白駒があれば間の駒を反転
                    if (rtop.classList.contains('white')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(selectedPoint)-9 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');
                            i = 11;
                        }
                        let rtbtwn = Number(String(rtop.id));
                        // 配置地点から同色マスまでを全て取得
                        for (let j = Number(selectedPoint)-9; j >= rtbtwn; j-=9) {
                            let bt = String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('black') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
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
            
            // 左上の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(selectedPoint)-11; i > 11; i-=11) {
                let lt = String(i);
                if(Number(lt.substring(1)) < 0 || Number(lt.substring(0, 1)) < 0) {
                    continue;
                } 
                let ltop = document.getElementById(lt);       
                try {
                    // 一つでも白駒があれば間の駒を反転
                    if (ltop.classList.contains('white')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(selectedPoint)-11 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');
                            i = 11;
                        }
                        let ltbtwn = Number(String(ltop.id));
                        // 配置地点から同色マスまでを全て取得
                        for (let j = Number(selectedPoint)-11; j >= ltbtwn; j-=11) {
                            let bt = String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('black') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('white');  
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
                            if (btel.classList.contains('white') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
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
                            if (btel.classList.contains('white') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
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
                            if (btel.classList.contains('white') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
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
                            if (btel.classList.contains('white') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
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

            // 右下の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(selectedPoint)+11; i < 78; i+=11) {
                let rb = String(i);
                if(Number(rb.substring(1)) > 7 || Number(rb.substring(0, 1)) > 7) {
                    continue;
                } 
                let rbottom = document.getElementById(rb);       
                try {
                    // 一つでも白駒があれば間の駒を反転
                    if (rbottom.classList.contains('black')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(selectedPoint)+11 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');
                            i = 78;
                        }
                        let rbbtwn = Number(String(rbottom.id));
                        // 配置地点から同色マスまでを全て取得
                        for (let j = Number(selectedPoint)+11; j <= rbbtwn; j+=11) {
                            let bt = String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('white') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
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
            
            // 左下の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(selectedPoint)+9; i < 76; i+=9) {
                let lb = String(i);
                if(Number(lb.substring(1)) < 0 || Number(lb.substring(0, 1)) > 7) {
                    continue;
                } 
                let lbottom = document.getElementById(lb);       
                try {
                    // 一つでも白駒があれば間の駒を反転
                    if (lbottom.classList.contains('black')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(selectedPoint)+9 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');
                            i = 76;
                        }
                        let lbbtwn = Number(String(lbottom.id));
                        // 配置地点から同色マスまでを全て取得
                        for (let j = Number(selectedPoint)+9; j <= lbbtwn; j+=9) {
                            let bt = String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('white') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
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
            
            // 右上の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(selectedPoint)-9; i > 11; i-=9) {
                let rt = String(i);
                if(Number(rt.substring(1)) > 7 || Number(rt.substring(0, 1)) < 0) {
                    continue;
                } 
                let rtop = document.getElementById(rt);       
                try {
                    // 一つでも白駒があれば間の駒を反転
                    if (rtop.classList.contains('black')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(selectedPoint)-9 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');
                            i = 11;
                        }
                        let rtbtwn = Number(String(rtop.id));
                        // 配置地点から同色マスまでを全て取得
                        for (let j = Number(selectedPoint)-9; j >= rtbtwn; j-=9) {
                            let bt = String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('white') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
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
            
            // 左上の全ての駒を取得しながら駒の有無を判定
            for (let i = Number(selectedPoint)-11; i > 11; i-=11) {
                let lt = String(i);
                if(Number(lt.substring(1)) < 0 || Number(lt.substring(0, 1)) < 0) {
                    continue;
                } 
                let ltop = document.getElementById(lt);       
                try {
                    // 一つでも白駒があれば間の駒を反転
                    if (ltop.classList.contains('black')) {
                        // 下一つ隣が白の場合は処理せずにループを抜ける
                        if (i === Number(selectedPoint)-11 && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');
                            i = 11;
                        }
                        let ltbtwn = Number(String(ltop.id));
                        // 配置地点から同色マスまでを全て取得
                        for (let j = Number(selectedPoint)-11; j >= ltbtwn; j-=11) {
                            let bt = String(j);
                            let btel = document.getElementById(bt);
                            // 間に駒がある場合は反転
                            if (btel.classList.contains('white') && !stopInversion) {
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
                            }
                        }
                        // 間に駒なしマスがある場合は反転不可
                        if (stopInversion && !changeable) {
                            td.innerHTML = '';
                            td.classList.remove('black');  
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

    });


}