(function() {
    'use strict';
    {
        // ボード描画などのメイン処理
        class Main {
            createColumn(cols) {
                // 1~15までの数値を格納した配列を生成
                const source = [];
                for (let i = 0; i < 15; i++) {
                    source[i] = i + 1 + 15 * cols;
                }
        
                // ランダムに5つ抽出した配列columnを生成
                const column = [];
                for (let i = 0; i < 5; i++) {
                    // 真ん中は「FREE」
                    if (cols == 2 && i == 2) {
                        column[i] = "FREE";
                    } else {
                        column[i] = source.splice(Math.floor(Math.random()*source.length), 1)[0];
                    }
                }
    
                return column;
            }
            createColumns() {
                const columns = [];
                for (let i = 0; i < 5; i++) {
                    columns[i] = this.createColumn(i);
                }
                return columns;
            }
            createTable(columns) {
                const tbody = document.querySelector('tbody');
                for (let row = 0; row < 5; row++) {
                    const tr = document.createElement('tr');
                    for (let col = 0; col < 5; col++) {
                        const td = document.createElement('td');
                        td.classList.add('notSelected');
                        td.innerHTML = columns[col][row];
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);        
                }
            }
        }

        // アドオン機能を追加
        class addOn {
            // 数字取得用のサブフォームを開く
            getNumber() {
                const btn = document.getElementById('button');
                function dispSubForm(url) {
                    btn.addEventListener('click', ()=> {
                        window.open(url,'subForm','top=100,left=400,width=500,height=300,scrollbars=yes');
                    });
                }
                dispSubForm("https://local.test/MyApps/BingoSheet_RE/index2.html");
            }
            
        }

        
  
        /** 実行*/ 
        // メイン描画
        const main = new Main();
        const columns = main.createColumns();
        main.createTable(columns);

        // サブフォーム呼び出し＆番号取得
        const addon = new addOn();
        addon.getNumber();


    }

})();