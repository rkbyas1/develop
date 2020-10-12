(function() {
    'use strict';
    {
        // グローバル変数（現在年月日を取得）
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let today = new Date();
        let yyyy,mm,dd;

        // メインクラス
        class Main {
            // 本日日付をセット
            setDate() {
                yyyy = today.getFullYear();
                mm = ("0"+(today.getMonth()+1)).slice(-2);
                dd = ("0"+today.getDate()).slice(-2);
                document.getElementById("date").value = yyyy + '-' + mm + '-' + dd;
            }
            getCalendarHead(m = month) {
                const dates = [];     
                const d = new Date(year, m, 0).getDate(); // 先月末日の日付
                const n = new Date(year, m, 1).getDay(); // 今月一日の曜日
                for (let i = 0; i < n; i++) {
                    dates.unshift({
                        date: d-i,
                        isToday: false,
                        isDisabled: true
                    });
                }
                return dates;
            }
            getCalendarBody(m = month) {
                const dates = [];
                const lastDate = new Date(year, m+1, 0).getDate(); // 今月の末日＝翌月1日の1日前＝翌月の0日目
                const dateObject = new Date();
                // 月の最終日まで日取得
                for (let i = 1; i <= lastDate; i++) {
                    dates.push({
                        date: i,
                        // today判定を含める
                        isToday: year == dateObject.getFullYear() && m == dateObject.getMonth() && i == dateObject.getDate() ? true : false,
                        isDisabled: false,
                    });
                }
                return dates;
            }
            getCalendarTail(m = month) {
                const dates = [];
                const lastDay = new Date(year, m+1, 0).getDay(); // 今月最後の曜日
                for (let i = 1; i < 7-lastDay; i++) {
                    dates.push({
                        date: i,
                        isToday: false,
                        isDisabled: true
                    });
                }
                return dates;
            }
            clearCalendar() {
                // tbodyをクリア
                const tbody = document.querySelector('tbody');
                if (tbody) {
                    while (tbody.firstChild) {
                        tbody.removeChild(tbody.firstChild);
                    }
                }
            }
            renderTitle() {
                // 表示日付(タイトル)の描画
                const title = document.getElementById('title');
                if (title) {
                    title.innerHTML = `${year}/${String(month+1).padStart(2, '0')}`;
                }
            }
            renderWeeks(month) {
                const dates = [
                    // 各配列を展開し、一つの配列にする
                    ...this.getCalendarHead(month),
                    ...this.getCalendarBody(month),
                    ...this.getCalendarTail(month)
                ];
                const weeks = []; //週ごとの配列
                const weekesCount = dates.length/7; //何週分あるか
                // 週ごとに日付を格納した配列を作成
                for (let i = 0; i < weekesCount; i++) {
                    weeks.push(dates.splice(0, 7));
                }
                // HTMLに適用
                weeks.forEach((week) => {
                    const tr = document.createElement('tr');
                    for (const date of week) {
                        const td = document.createElement('td');
                        td.innerHTML = date.date;
                        // 本日日付の判定
                        if (date.isToday) {
                            td.classList.add('today');
                        }
                        // 当月以外日付の判定
                        if (date.isDisabled) {
                            td.classList.add('disabled');
                        }
                        tr.appendChild(td);
                    }
                    document.querySelector('tbody').appendChild(tr);
                });
            }
            // 実行
            createCalendar() { 
                this.clearCalendar();
                this.renderTitle();
                this.renderWeeks(month);            
            }
        }
        // 初期表示時の描画
        const main = new Main();
        main.createCalendar();
        main.setDate();

        // 該当年全ての月日カレンダーを表示するクラス
        class Render {
            clearCurrentData() {
                // ひと月分のカレンダーを非表示にする
                const def = document.querySelectorAll('thead#hdef, tbody#bdef, tfoot#fdef');
                for (let i = 0; i < def.length; i++) {
                    def[i].classList.add('hidden');
                }
            }
            renderData() {
                // 動的生成部分を削除
                const table2 = document.getElementById('second');
                document.getElementById('tableWrap').removeChild(table2);
                // 一旦全てのテーブル子要素を削除
                const table = document.getElementById('first');
                const tableChild = document.querySelectorAll('thead, tbody, tfoot');
                for (let i = 0; i < tableChild.length; i++) {
                    if (!tableChild[i].id) {
                        table.removeChild(tableChild[i]);
                    }
                }
            }
            drawHeader(i) {
                const weekArray = [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat"
                ];
                // ヘッダー日付部
                const thead = document.createElement('thead');
                const tr = document.createElement('tr');
                const th = document.createElement('th');
                th.innerHTML = `${String(year)}/${('0' + String(i)).slice(-2)}`; //桁揃え
                th.colSpan = weekArray.length;
                th.classList.add('yeardates');
                // th.id = `${i}th`;
                tr.appendChild(th);

                // ヘッダー曜日部
                const tr2 = document.createElement('tr');
                let th2;
                for (let j = 0; j < weekArray.length; j++) {
                    th2 = document.createElement('th');
                    th2.innerHTML = weekArray[j];
                    // 日曜日
                    if (j == 0) {
                        th2.style.color = '#f00';
                    }
                    // 土曜日
                    if (j == 6) {
                        th2.style.color = '#00f';
                    }
                    tr2.appendChild(th2);
                }
                thead.appendChild(tr);
                thead.appendChild(tr2);

                return thead;
            }
            drawBody(i) {
                const tbody = document.createElement('tbody');
                const dates = [
                    // 各配列を展開し、一つの配列にする
                    ...main.getCalendarHead(i-1),
                    ...main.getCalendarBody(i-1),
                    ...main.getCalendarTail(i-1)
                ];
                const weeks = []; //週ごとの配列
                const weekesCount = dates.length/7; //何週分あるか
                // 週ごとに日付を格納した配列を作成
                for (let k = 0; k < weekesCount; k++) {
                    weeks.push(dates.splice(0, 7));
                }
                // HTMLに適用
                weeks.forEach((week) => {
                    const tr = document.createElement('tr');
                    for (const date of week) {
                        const td = document.createElement('td');
                        td.innerHTML = date.date;
                        // 本日日付の判定
                        if (date.isToday) {
                            td.classList.add('today');
                        }
                        // 当月以外日付の判定
                        if (date.isDisabled) {
                            td.classList.add('disabled');
                        }
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                });
                return tbody;
            }
            // 全月表示用メソッド
            drawAllMonth() {
                // table要素の取得or作成
                const table = document.querySelector('table');
                const table2 = document.createElement('table');

                for (let i = 1; i <= 12; i++) {
                    // ヘッダー部の描画
                    const thead = this.drawHeader(i);
                    // ボディ部の描画
                    const tbody = this.drawBody(i);
                    // 親table要素に適用
                    if (i <= 6) {
                        table.appendChild(thead);
                        table.appendChild(tbody);
                    } else if (i > 6) {
                        table2.appendChild(thead);
                        table2.appendChild(tbody);
                    }
                }
                // 適用＆id振り
                document.getElementById('tableWrap').appendChild(table2);
                table.id = 'first';
                table2.id = 'second';

                /** スタイル調整*/
                // 6カ月ごとに横並び
                const tbwp = document.getElementById('tableWrap');
                tbwp.style.display = 'flex';
                tbwp.style.width = '500px';
                tbwp.style.margin = '0 auto';

                // ボタン表示
                document.getElementById('lastYear').classList.remove('hidden');
                document.getElementById('nextYear').classList.remove('hidden');
                document.getElementById('thisYear').classList.remove('hidden');
                document.body.style.fontSize = '14px';
                // table要素の幅や位置調整
                const tbles = document.querySelectorAll('table');
                for (let i = 0; i < tbles.length; i++) {
                    tbles[i].style.width = '100px';
                    tbles[i].style.margin = '0 15px';
                }
                // td,th要素のpadding調整
                const tbleData = document.querySelectorAll('th,td');
                for (let i = 0; i < tbleData.length; i++) {
                    tbleData[i].style.padding = '2px';
                }
            }
        }

        // イベントクラス
        class Event {
            // 前月
            goPreviousMonth() {
                document.getElementById('prev').addEventListener('click', ()=> {
                    month--;
                    if (month < 0) {
                        month = 11;
                        year--;
                    }
                    main.createCalendar();
                });
            }
            // 次月
            goNextMonth() {
                document.getElementById('next').addEventListener('click', ()=> {
                    month++;
                    if (month > 11) {
                        month = 0;
                        year++;
                    }
                    main.createCalendar();
                });
            }
            // 今日日付へジャンプ
            goToday() {
                document.getElementById('today').addEventListener('click', ()=> {
                    year = today.getFullYear();
                    month = today.getMonth();
                    main.createCalendar();
                });
            }
            // 指定日付へジャンプ
            goSelectedDate() {
                document.getElementById('go').addEventListener('click', ()=> {
                    const date = document.getElementById('date').value;
                    year = Number(date.substr(0,4));
                    month = Number(date.substr(5,2)) - 1;
                    main.createCalendar();
                });
            }
            // 全月表示
            showAllMonth() {
                document.getElementById('title').addEventListener('click', ()=> {
                    this.reDraw();
                    this.moveToMonth();
                });
            }
            // 今の表示をクリア後に全月を表示
            reDraw() {
                const render = new Render();
                render.clearCurrentData();
                render.drawAllMonth();
            }
            reDraw2() {
                const render = new Render();
                render.renderData();
                render.drawAllMonth();
                this.moveToMonth();
            }
            // 年移動ボタン押下時
            moveYear() {
                // 前年
                document.getElementById('lastYear').addEventListener('click', ()=> {
                    year--;
                    this.reDraw2();
                });
                // 次年
                document.getElementById('nextYear').addEventListener('click', ()=> {
                    year++;
                    this.reDraw2();
                });
                // 今年
                document.getElementById('thisYear').addEventListener('click', ()=> {
                    year = new Date().getFullYear();
                    this.reDraw2();
                });
            }
            // 全月表示→クリックした月のみ表示
            moveToMonth() {
                // クリックした年月を取得
                const yearMonth = document.getElementsByClassName('yeardates');
                let selected;
                for (let i = 0; i < yearMonth.length; i++) {
                    // クリックアクション内
                    yearMonth[i].addEventListener('click', e => {
                        selected = e.path[0].innerHTML;
                        year = Number(String(selected).substr(0,4));
                        month = Number(String(selected).substr(5,2));
                        month--;
                        const render = new Render();
                        render.clearCurrentData();
                        // htmlDOMを再描画
                        this.clearAllMonth();
                        main.createCalendar();
                    });
                } 
            }
            clearAllMonth() {
                // 全月表示部分のtableタグを削除し、ひと月表示タグを再表示
                const table1 = document.getElementById('first');
                // 動的生成部分を削除
                const table2 = document.getElementById('second');
                document.getElementById('tableWrap').removeChild(table2);

                const tdata = document.querySelectorAll('thead, tbody, tfoot');
                for (let i = 0; i < tdata.length; i++) {
                    if (tdata[i].classList.contains('hidden')) {
                        tdata[i].classList.remove('hidden');
                    } else {
                        table1.removeChild(tdata[i]);
                    }
                }
                // スタイル調整
                const table = document.querySelector('table');
                table.style.width = '400px';
                table.style.margin = '0 auto';
                document.getElementById('lastYear').classList.add('hidden');
                document.getElementById('nextYear').classList.add('hidden');
                document.getElementById('thisYear').classList.add('hidden');
                document.body.style.fontSize = '22px';   
                const tbleData = document.querySelectorAll('th,td');
                for (let i = 0; i < tbleData.length; i++) {
                    tbleData[i].style.padding = '10px';
                }        
            }
            // イベント実行用
            eventExecute() {
                this.goPreviousMonth();
                this.goNextMonth();
                this.goToday();
                this.goSelectedDate();
                this.showAllMonth();
                this.moveYear();
            }
        }
        const e = new Event();
        e.eventExecute();
    }

})();