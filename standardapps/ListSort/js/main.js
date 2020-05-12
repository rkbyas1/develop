(function() {
    'use strict';

    const th = document.getElementsByTagName('th');
    let sortOrder = 1; //1：昇順 -1：降順

    function revuildTbody(rows) {
        let tbody = document.querySelector('tbody');
        // tbodyの最初の子要素がある限りtbodyの子要素を削除する
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        // tbodyに並べ替えたrowsを追加
        for (const row of rows) {
            tbody.appendChild(row);
        }
    }

    function updateClassName(th, h) {
        // ソートアイコンを付加
        for (const h2 of th) {
            h2.className = '';
        }
        h.className = sortOrder === 1 ? 'asc' : 'desc';
    }

    function compare(a, b, col, type) {
        // trの子要素tdを取得
        let _a = a.children[col].innerHTML;
        let _b = b.children[col].innerHTML;
        // 数値は数値型に変換
        if (type === 'number') {
            _a = _a * 1;
            _b = _b * 1;
        // 文字列は小文字変換して比較
        } else if (type === 'string'){
            _a = _a.toLowerCase();
            _b = _b.toLowerCase();
        }
        // ソートのメインロジック
        if (_a < _b) {
            return -1;
        }
        if (_a > _b) {
            return 1;
        }
        return 0;
    }

    function sortRows(h) {
        let col = h.cellIndex;
        // データ型
        let type = h.dataset.type;
        // 行取得、NodeListから配列へ変換
        let rows = Array.prototype.slice.call(document.querySelectorAll('tbody > tr')); 
        /** ソートアルゴリズム関数（ロジックはググればある決まり文句らしい）*/
        // rows値をa,bに代入
        rows.sort((a, b) => {
            return compare(a, b, col, type) * sortOrder;
        });
        return rows
    }

    function setup() {
        for (const h of th) {
            h.addEventListener('click', () => {
                let rows = sortRows(h);    
                revuildTbody(rows);
                updateClassName(th, h);
                // ソート反転
                sortOrder *= -1;
            });  
        }
    }

    setup();

    

})();