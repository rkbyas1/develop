'use strict';

{
    const question = document.getElementById("question");
    const choices = document.getElementById("choices");
    const btn = document.getElementById("btn");
    const result = document.getElementById("result");
    // スコア表示用にhtmlのresult>p要素を取得
    const scoreLabel = document.querySelector('#result > p');

    // オブジェクト配列（質問一覧）（必ず0番目が正解となる）
    const quizSet = shuffle([
        {q: '人類最速の男は？', c:['ウサイン・ボルト','カール・ルイス','モーリス・グリーン']},
        {q: '2の8乗は？', c:['256','236','356']},
        {q: '100m走の世界記録は？', c:['9"58','9"63','9"79']},
    ]);
    // 現在の質問番号
    let currentNum = 0;
    // 既に回答が選択されたか
    let isAnswered;
    // 正当数
    let score = 0;


    // 引数に配列arrを渡したらarrをシャッフルして返す
    function shuffle(arr){
        // ランダム選択の終点（配列の最後の値）のインデックス=i
        for (let i = arr.length - 1; i > 0; i--){
            // ランダムに選ぶ要素のインデックス
            const j = Math.floor(Math.random() * (i + 1));
            // arrのi番目とj番目を入れ替える（分割代入）
            [arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr;
    }

    // 選択肢クリック時に走る判定処理
    function checkAnswer(li) {
        // 回答していなかったらフラグをtrueに変更
        if (!isAnswered) {
            isAnswered = true;
            // liの判定（配列の0番目が正解）
            if (li.textContent === quizSet[currentNum].c[0]) {
                // 正解なら以下のCSSを適用する
                li.classList.add('correct');
                // scoreを加算
                score++;
            } else {
                // 不正解ならwrongのCSSを適用
                li.classList.add('wrong');
            }      
        // 回答済みであれば何もしない   
        } else {
            return;
        }          
    }

    function setQuiz() {
        // 未回答のためfalseを設定
        isAnswered = false;
        // questionにquizSet配列のcurrentNum番目のq要素を取り出す
        question.textContent = quizSet[currentNum].q;
        // choicesの最初の子要素があれば削除する
        while (choices.firstChild) {
            choices.removeChild(choices.firstChild);
        }
        // 選択肢をシャッフルしてから表示する
        const shuffledChoices = shuffle([...quizSet[currentNum].c]);

        // quizSet配列のc要素を一つずつ取り出し、choice変数に代入
        shuffledChoices.forEach(choice =>{
            const li = document.createElement('li');
            // liに値を表示
            li.textContent = choice;
            // 親要素(choices)に対して子要素(li)を追加(選択肢を表示)する
            choices.appendChild(li);            
            // クリック時にli要素のチェックを行う
            li.addEventListener('click', () => {
                // checkAnswer関数の呼び出し
                checkAnswer(li);
                // 回答後にボタンをアクティブにする
                btn.classList.remove('disabled');
            });
        });
        // 最後の問題ではshow scoreを表示する
        if (currentNum === quizSet.length-1) {
            btn.textContent = 'show Score';
        }
    }

    setQuiz();

    /** nextボタン押下時の処理 */
    btn.addEventListener('click', ()=> {
        // ボタンが非アクティブの際は次の質問に行かない
        if (btn.classList.contains('disabled')){
            return;
        // ボタンがアクティブの際は次の質問へ
        } else {
            // ボタンをグレーに戻す
            btn.classList.add('disabled');
        }
        // 最後の問題のときに正当数を表示
        if (currentNum === quizSet.length-1){
            // scoreLabelにスコアを表示
            scoreLabel.textContent = `Score: ${score} / ${quizSet.length}`;
            // スコア表示時はhiddenクラスを外し、resultセクションを表示
            result.classList.remove('hidden');
        } else {
            // 次質問に行くためcurrentNumを+1
            currentNum++;
            // 次の質問へ行く
            setQuiz();
        }
    })
}