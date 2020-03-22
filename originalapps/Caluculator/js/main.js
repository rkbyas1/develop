'use strict';
{
    let calcFlg;
    let inpFlg;
    let firstInp;
    let SecondInp;
    let result;
    let seqFlg;
    let pushCalcBtn;
    const inp = document.querySelector('input');

    function init() {
        // 0:初期 1:足算 2:引算 3:掛算 4:割算
        calcFlg = 0;
        inpFlg = false;
        seqFlg = false;
        firstInp = '';
        SecondInp = '';
        result = '';
        inp.value = 0;
        // 演算ボタンが連続入力された判定
        pushCalcBtn = false;
    }
    init();

    for (let i = 0; i < 17; i++) {
        const btn = document.getElementById(String(i));
        let inpVal = btn.value;
        
        btn.addEventListener('click', () => {
            // 1回目の入力
            if (calcFlg === 0) {
                // Cボタンは入力欄をクリア
                if (inpVal === 'C') {
                    init();
                }
                // 数字またはドットが入力された場合
                if (Number(inpVal) >= 0 || inpVal === '.') {
                    if (inp.value === '0') {
                        // 0台小数点の時0は消さないように
                        if (inpVal === '.') {
                            // 処理なしスキップ
                        } else {
                            inp.value = '';
                        }
                    }
                    inp.value += inpVal;
                // 数字以外が入力された場合
                } else {
                    // 足算
                    if (inpVal === '+') {
                        firstInp = inp.value;
                        calcFlg = 1;
                    }
                    // 引算
                    if (inpVal === '-') {
                        firstInp = inp.value;
                        calcFlg = 2;
                    }
                    // 掛算
                    if (inpVal === '×') {
                        firstInp = inp.value;
                        calcFlg = 3;
                    }
                    // 割算
                    if (inpVal === '÷') {
                        firstInp = inp.value;
                        calcFlg = 4;
                    }
                }
            // 演算ボタン押下した状態
            } else {
                if (Number(inpVal) >= 0 || inpVal === '.') {
                    if (!inpFlg) {
                        inp.value = '';
                        inpFlg = true;
                    }
                    inp.value += inpVal;
                    SecondInp = inp.value;
                    pushCalcBtn = false;
                // 数字以外が入力された場合
                } else {
                    // Cボタンは入力欄をクリア
                    if (inpVal === 'C') {
                        init();
                    }   
                    if (inpVal === '+' || inpVal === '-' ||
                            inpVal === '×' || inpVal === '÷') {                              
                                // 各種演算  
                                if (SecondInp) {
                                    if (calcFlg === 1) {
                                        if (seqFlg && !pushCalcBtn) {
                                            result = result + Number(inp.value);
                                        } else if (!seqFlg) {
                                            result = Number(firstInp) + Number(SecondInp);
                                        }   
                                    }
                                    if (calcFlg === 2) {
                                        if (seqFlg && !pushCalcBtn) {
                                            if (Number(inp.value) >= 0) {
                                                result = result - Number(inp.value);
                                            }
                                        } else if (!seqFlg) {
                                            result = Number(firstInp) - Number(SecondInp);
                                        }
                                    }
                                    if (calcFlg === 3) {
                                        if (seqFlg && !pushCalcBtn) {
                                            result = result * Number(inp.value);
                                        } else if (!seqFlg) {
                                            result = Number(firstInp) * Number(SecondInp);
                                        }
                                    }
                                    if (calcFlg === 4) {
                                        if (seqFlg && !pushCalcBtn) {
                                            result = result / Number(inp.value);
                                        } else if (!seqFlg) {
                                            result = Number(firstInp) / Number(SecondInp);
                                        }
                                    }  
                                }
                                // 押下された演算ボタンに応じてフラグを書き換え
                                if (inpVal === '+') {
                                    calcFlg = 1;
                                } else if (inpVal === '-') {
                                    calcFlg = 2;
                                } else if (inpVal === '×') {
                                    calcFlg = 3;
                                } else if (inpVal === '÷') {
                                    calcFlg = 4;
                                }
                        // 演算ボタン押下フラグをtrueに
                        pushCalcBtn = true;
                    }
                    // = 押下の場合は結果表示＆フラグリセット
                    if (inpVal === '=') {
                        // 足算
                        if (calcFlg === 1) {
                            if (seqFlg) {
                                result = result + Number(inp.value);
                            } else {
                                result = Number(firstInp) + Number(SecondInp);
                            }
                            inp.value = result;
                        }
                        // 引算
                        if (calcFlg === 2) {
                            if (seqFlg) {
                                result = result - Number(inp.value);
                            } else {
                                result = Number(firstInp) - Number(SecondInp);
                            }
                            inp.value = result;
                        }
                        // 掛算
                        if (calcFlg === 3) {
                            if (seqFlg) {
                                result = result * Number(inp.value);
                            } else {
                                result = Number(firstInp) * Number(SecondInp);
                            }
                            inp.value = result;
                        }
                        // 割算
                        if (calcFlg === 4) {
                            if (seqFlg) {
                                result = result / Number(inp.value);
                            } else {
                                result = Number(firstInp) / Number(SecondInp);
                            }
                            inp.value = result;
                        }
                        calcFlg = 0;
                    }
                    if (result) {
                        inp.value = result;
                        // init();
                        inpFlg = false;
                        seqFlg = true;
                    }
                }    
            }
        });
    }


}