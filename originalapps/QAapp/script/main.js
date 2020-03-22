'use strict';
{


    // HTMLの質問一覧を取得
    for(let i = 1; i<=10; i++) {
        const question = document.getElementById(`question${i}`);
        // チェックを全てON
        question.checked = true;
    }

    // 回答一覧の回答1を初期値チェックON
    const answer1 = document.getElementById('answer1');
    answer1.checked = true;

    // チェックボタン押下時
    // 質問一覧チェックがあるもので回答一覧にチェックない場合はエラー
    const btn = document.getElementById('btn');
    let cnt = 0;
    btn.addEventListener('click', ()=> {
        cnt = 0;
        // HTMLから質問一覧と回答一覧を取得して表示する
        for(let i=1; i<=10; i++) {
            const q = document.getElementById(`question${i}`);
            const a = document.getElementById(`answer${i}`);
            // ロジックチェック
            if(!q.checked && a.checked) {
                cnt++;
            }
        }
        // メッセージ出力
        if(cnt >= 1) {
            alert('チェックが不適切な箇所があるよお')
        } else {
            alert('OK');
        }
    });

        



    

    
}