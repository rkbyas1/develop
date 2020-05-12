'use strict';

{
    const timer = document.getElementById('timer');
    const start = document.getElementById('start');
    const stop = document.getElementById('stop');
    const reset = document.getElementById('reset');

    let startTime;
    let timeoutId;

    //途中で止めて再度再開する際の時間を保持
    let elapsedTime = 0;

    function countUp() {
        /* startTimeからの経過時間 */
        //console.log(Date.now() - startTime);

        /* startTimeからの経過時間を年月日時秒形式に変換(Date)し、メソッド化する */
        const d = new Date(Date.now() - startTime + elapsedTime);
        debugger;
        const m = String(d.getMinutes()).padStart(2,"0");
        debugger;
        const s = String(d.getSeconds()).padStart(2,"0");
        debugger;
        const ms = String(d.getMilliseconds()).padStart(3,"0");
        debugger;
        timer.textContent = `${m}:${s}.${ms}`;
        
        //現時刻とstartTimeの差が10ミリ秒毎に表示される
        timeoutId = setTimeout( () => {
            countUp();
        }, 10);
    }

    function setButtonStateIni(){
        start.classList.remove('inactive');
        stop.classList.add('inactive');
        reset.classList.add('inactive');
    }
    function setButtonStateRunning(){
        start.classList.add('inactive');
        stop.classList.remove('inactive');
        reset.classList.add('inactive');
    }
    function setButtonStateStopped(){
        start.classList.remove('inactive');
        stop.classList.add('inactive');
        reset.classList.remove('inactive');
    }
    //初期表示時
    setButtonStateIni();

    //スタートボタン
    start.addEventListener('click', () => {
        if (start.classList.contains('inactive') === true){
            return;
        } else {
            setButtonStateRunning();
            startTime = Date.now();
            countUp();
        }

    });

    //ストップボタン
    stop.addEventListener('click', () => {
        if (stop.classList.contains('inactive') === true){
            return;
        } else {
            setButtonStateStopped();
            /* clearTimeout:setTimeoutでセットしたタイマーを解除する */
            clearTimeout(timeoutId);
            elapsedTime += Date.now() - startTime;
        }  

    });

    //リセットボタン
    reset.addEventListener('click', () => {
        if (reset.classList.contains('inactive') === true){
            return;
        } else {
            setButtonStateIni();
            timer.textContent = '00:00.000';
            elapsedTime = 0;
        }      

    });
}