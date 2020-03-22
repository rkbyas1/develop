'use strict';
{
    // 質問一覧の配列データ
    let questions =
    [
        {"no":1, "q":"【クイズ1】アブラカタブラの意味は「痛いの痛いの飛んでけ」である", "a":"〇"},
        {"no":2, "q":"【クイズ2】サランラップのもととなる製品は昔、戦争で重宝されていた", "a":"〇"},
        {"no":3, "q":"【クイズ3】点滴の成分は砂糖水とほぼ同じである", "a":"×"},
        {"no":4, "q":"【クイズ4】明治時代に超能力に関しての裁判が行われたことがある", "a":"〇"},
        {"no":5, "q":"【クイズ5】瞬間接着剤は工作用に開発されたものである", "a":"×"},
        {"no":6, "q":"【クイズ6】ハイジャックの語源は「高い空の上で飛行機を奪うから」である", "a":"×"},
        {"no":7, "q":"【クイズ7】パフェとサンデーの違いは作られた国である", "a":"〇"},
        {"no":8, "q":"【クイズ8】ピーマンとパプリカの違いは色である", "a":"〇", "l":"https://rassic.jp/content/280"},
        {"no":9, "q":"【クイズ9】バーベキュー味は元々はカレー味として開発されていた", "a":"×"},
        {"no":10, "q":"【クイズ10】ウサインボルトの100M世界記録9秒58は2019年12月現在破られていない", "a":"〇", "l":"https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%B5%E3%82%A4%E3%83%B3%E3%83%BB%E3%83%9C%E3%83%AB%E3%83%88"}
    ];

    // 変数
    let dispArea = document.getElementById('display_area');
    let question = document.getElementById('question');
    let branch = document.getElementById('branch');
    let ok = document.getElementById('ok');
    let ng = document.getElementById('ng');
    let ansdisp = document.getElementById('ansdisp');
    let anslink = document.getElementById('anslink');
    let qs = [];
    let radioNum = 0;
    let onceDisplayed = false;
    let p = '';
    let details = 'Details';

    // 設問初期表示
    p = document.createElement('p');
    p.innerHTML = questions[0].q;
    question.appendChild(p); 

    function dispLink(link) {
        if (link) {
            anslink.innerHTML = details.link(link);
        } else {
            anslink.innerHTML = '';
        }
    }

    // 正誤表示関数
    function dispAnswer(q) {
        // 「マル」ボタンクリック時の挙動
        ok.addEventListener('click', e => {
            if (q.a === '×') {
                ansdisp.innerHTML = `不正解（答えは${q.a}）`;
                dispLink(q.l);
            } else {
                ansdisp.innerHTML = `正解（答えは${q.a}）`; 
                dispLink(q.l);               
            }
        });
        // 「バツ」ボタンクリック時の挙動
        ng.addEventListener('click', e => {
            if (q.a === '×') {
                ansdisp.innerHTML = `正解（答えは${q.a}）`;
                dispLink(q.l);
            } else {
                ansdisp.innerHTML = `不正解（答えは${q.a}）`;
                dispLink(q.l);
            }
        });
    }
    // 初回表示用
    if (!onceDisplayed) {
        dispAnswer(questions[0]);
    }

    // 回答情報をクリアする関数
    function clearInfo() {
        for (const ans of document.getElementsByName('answer')) {
            ans.checked = false;
        }
        ansdisp.innerHTML =　'';
        anslink.innerHTML =　'';
    }

    // ラジオボタン選択を変えたときの変更先をイベントから取得
    dispArea.addEventListener('change', event => {
        // 回答情報を全てクリア
        clearInfo();
        // クリックしたラジオボタンのid
        let e = event.target.id;
        // idからラジオボタン番号を取得
        radioNum = Number(e.substring(2));

        
        // ラジオ選択した番号に対応する設問を表示
        for(let q of questions) {
            // ラジオボタンと設問番号を比較し、同じであれば設問を表示
            if (radioNum === q.no) {
                // 初回
                if (!onceDisplayed) {
                    question.removeChild(p);
                    p = document.createElement('p');
                    p.innerHTML = q.q;
                    question.appendChild(p); 
                    onceDisplayed = true;
                    dispAnswer(q);
                // 2回目以降クリック
                // 前回までの設問表示を削除し、新しい設問を追加
                } else {
                    question.removeChild(p);
                    p.innerHTML = q.q;
                    question.appendChild(p);  
                    dispAnswer(q);
                }
            }
        }
    });




}