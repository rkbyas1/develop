'use strict';

{
    /* CSSのボタン要素を取得 */
    const btn = document.getElementById('btn');

    btn.addEventListener('click', () => {
        // //const results = ['大吉', 'タヌ吉', '末吉', '凶'];
        // const results = ['大吉', '大吉', '大吉', '凶'];
        // /* ランダム整数*/
        // btn.textContent = results[Math.floor(Math.random() * results.length)];

        const n = Math.random();
        if (n < 0.05){
            btn.textContent = '大吉'; //5%
        } else if(n < 0.2){
            btn.textContent = 'タヌ吉'; //15%
        } else {
            btn.textContent = '中吉'; //80%
        }
    });
}