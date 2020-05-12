'use strict';

{
    // 打込用の文字列を格納した配列
    const words = [
        'apple',
        'sky',
        'blue',
        'middle',
        'set',
    ];
    // 配列の中身をランダムに取り出す
    let word;
    // 今何文字目を打っているか
    let loc; 
    // スコア表示用
    let score;
    // ミス表示用
    let miss;
    // ゲーム終了時間（n秒 * 1000で秒に変換）
    const timeLimit = 3 * 1000;
    // ゲーム開始時間
    let startTime;
    // ゲームが開始しているかどうかを判断
    let isPlaying = false;

    /* ID要素変数の取得 */ 
    const target = document.getElementById('target');
    const scoreLabel = document.getElementById('score');
    const missLabel = document.getElementById('miss');
    const timerLabel = document.getElementById('timer');
  

    function updateTarget(){
        let underbar = '';
        // locと同じ数のアンダーバーをunderbarに連結
        for (let i = 0; i < loc; i++){
            underbar += '_';
        }
        // underbarとlocから最後までの文字列と結合
        target.textContent = underbar + word.substring(loc);
    }

    function updateTimer() {
        // 残り時間 = 開始時刻+制限時間-現在時刻
        const timeLeft = startTime + timeLimit - Date.now();
        // 秒単位で小数点以下を2桁で表示
        timerLabel.textContent = (timeLeft / 1000).toFixed(2);

        // 繰り返してカウントダウン
        const timeoutId = setTimeout(() => {
            updateTimer();
            // 0.01秒ごとに表示
        }, 10);

        // 残り0秒になったらカウントダウンをストップ
        if (timeLeft < 0) {
            isPlaying = false;
            clearTimeout(timeoutId);
            // タイマーを0.00にセット
            timerLabel.textContent = '0.00';
            // 0.1秒後にブラウザポップアップでメッセージ表示
            setTimeout(() => { 
                showResult();
            }, 100);

            target.textContent = 'click to replay';
        }
    }

    function showResult(){
        const accracy = score + miss === 0 ? 0: score / (score + miss) * 100;
        alert(`${score} letters, ${miss} misses, ${accracy.toFixed(2)}%accuracy`)
    }

    // クリックした際に単語を表示して開始
    window.addEventListener('click', ()=>{
        // ゲームが進行中であればif以下の処理をしない
        console.log(isPlaying);
        debugger;
        if (isPlaying === true){
            return;
        } else {
            // クリック動作時のアニメーションを適用しない
            // let sty = document.getElementById('body');
            // sty.style.paddingTop = '40px';

            // 進行中フラグをtureにする
            isPlaying = true;

            // リプレイ時の初期化
            loc=0;
            score = 0;
            miss = 0;
            scoreLabel.textContent = score;
            missLabel.textContent = miss;
            word = words[Math.floor(Math.random() * words.length) ];

            target.textContent = word;
            // 開始時刻を取得
            startTime = Date.now();
            updateTimer();
        }

    })

    // キーを押したら以下の処理をする
    // eという引数を渡すとeにイベントオブジェクトが入る
    window.addEventListener('keydown', (e)=>{
        //  ゲーム開始していなければif(isPlaying)後の処理をスキップ
        if (isPlaying !== true) {
            return;
        }
        // e.Key＝打ったキー        
        // word（"apple"）のloc番目の文字にアクセス
        // word[loc]は初期値0　0番目=1文字目
        if (e.key === word[loc]) {
            console.log('score');
            loc += 1;
            // loc（現在地）と打つ単語の文字数が一致していたら
            // ＝ひとつの単語を打ち終わったら
            if (loc === word.length){
                // 次の単語をセット
                word = words[Math.floor(Math.random() * words.length) ];
                loc = 0;
            } 
            updateTarget();
            score += 1;
            //scoreLabelに表示
            scoreLabel.textContent = score;
        } else {
            console.log('miss');
            miss += 1;
            missLabel.textContent = miss;
        }
    })
}