(function() {
    'use strict';
    {
        function createColumn(cols) {
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

        function createColumns() {
            const columns = [];
            for (let i = 0; i < 5; i++) {
                columns[i] = createColumn(i);
            }
            return columns;
        }

        function createTable(columns) {
            const tbody = document.querySelector('tbody');
            for (let row = 0; row < 5; row++) {
                const tr = document.createElement('tr');
                for (let col = 0; col < 5; col++) {
                    const td = document.createElement('td');
                    td.innerHTML = columns[col][row];
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);        
            }
        }
        const columns = createColumns();
        createTable(columns);

    }

})();