(function() {
    'use strict';

    const card_area = document.getElementById('mainarea');
    const tds = document.getElementsByTagName('td');
    // カード画像たち（34枚）
    const images = [
        "11.png","12.png","13.png","14.png","15.png","16.png","17.png","18.png","19.png",
        "21.png","22.png","23.png","24.png","25.png","26.png","27.png","28.png","29.png",
        "31.png","32.png","33.png","34.png","35.png","36.png","37.png","38.png","39.png",
        "41.png","42.png","43.png","44.png","45.png","46.png","47.png"
    ];
    // 4枚（2ペア）ずつ準備
    const virtual_images = [
        ...images,
        ...images,
        ...images,
        ...images
    ];
    const back_side = "49.gif";
    let try_cnt = 0;
    let points = 0;
    let help_cnt = 10;
    
    // table要素でカードを配置する
    function renderTable() {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        let tr,td,img;
        let index = 0;

        for (let j = 0; j < 8; j++) {
            tr = document.createElement('tr');
            for (let i = 0; i < 17; i++) {
                td = document.createElement('td');
                img = document.createElement('img');
                // カード（裏面）画像ファイルを取得
                img.src = "images/" + back_side;
                // カード（表面）をランダムに紐づける
                img.classList.add(getRandomCard());

                td.appendChild(img)
                tr.appendChild(td);
                index++;
            }
            tbody.appendChild(tr);
        }       
        table.appendChild(tbody);     

        card_area.appendChild(table);
    }

    function getRandomCard() {
        // ランダム取得
        const index = Math.floor(Math.random() * (virtual_images.length));
        const select_card = virtual_images[index];
        const select_id = String(select_card);

        // 取得したidカードは配列から削除していく
        virtual_images.splice(index, 1);
        
        return select_id;
    }

    // アクション、イベント各種
    function getAction() {
        for (const td of tds) {
            td.addEventListener('click', e => {
                const img = td.firstChild;
                // 既に表のカードはクリック無効とする
                if (img.classList.contains('flipped') || img.id == 'selected') {
                    return;
                }
                // クリックしたカードを表にする
                let newCard = e.target.className;
                e.target.src = "images/" + newCard;
                // 試行回数をカウント
                try_cnt++;
                if (try_cnt % 2 == 0) {
                    document.getElementById('try').value = try_cnt/2;
                    // 開いた2ペアをチェックする
                    checkCard(e.target);
                } else {
                    e.target.id = "selected";
                }
            });
        }
        // helpボタン
        document.getElementById('help').addEventListener('click', ()=> {
            if (help_cnt > 0) {
                help();
            } else {
                alert("You cannot use help anymore!!");
            }
        });
    }

    function checkCard(target) {
        for (const td of tds) {
            const img = td.firstChild;
            if (img.id == 'selected') {
                // 一致していたらポイントのカウントアップ、フラグ更新
                if (img.currentSrc == target.src) {
                    points++;
                    document.getElementById('points').value = points;
                    target.classList.add('flipped');
                    img.classList.add('flipped');
                // 一致していなかったら1秒後に2つとも裏面に戻す（1.5秒後）
                } else {
                    setTimeout(() => {
                        target.src = "images/" + back_side;
                        img.src = "images/" + back_side;
                    }, 1500);
                }
                img.removeAttribute('id');
            }
        }
    }
    function help() {
        // ランダムに1行を2秒間表示
        const row_num = Math.floor(Math.random() * 8);
        const tr = document.querySelectorAll('table>tbody>tr')[row_num];
        const tds = tr.children;
        for (const td of tds) {
            const img = td.firstChild;
            // 表を表示 既に表になっているカードは除く
            if (!img.classList.contains('flipped')) {
                img.src = "images/" + img.className;
                // 3秒経過したら裏に戻す
                setTimeout(() => {
                    img.src = "images/" + back_side;
                }, 3000);
            }
        }
        help_cnt--;
        document.getElementById('helpcount').value = help_cnt;
    }

    renderTable();
    getAction();


})();