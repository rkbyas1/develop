'use strict';
{
    // 日付データ
    const days = [
        [0,'Sun'],
        [1,'Mon'],
        [2,'Tue'],
        [3,'Wed'],
        [4,'Thu'],
        [5,'Fri'],
        [6,'Sat']   
    ]; 
    // カレンダー表示エリア
    const dispContent = document.getElementById('calendar');
    // ヘッダー
    const header = document.querySelector('h2');

    // next,prev,jumpボタン
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const jump = document.getElementById('jump');
    next.style.userSelect = 'none';
    prev.style.userSelect = 'none';

    // 現在日時の取得
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    // 現在日付をinput欄に表示
    const date = document.getElementById('date');
    const today = String(currentYear) + "-" 
        + String(currentMonth).padStart(2, "0") + "-"
        + String(currentDay).padStart(2, "0");
    date.value = today;

    // カレンダーデータ格納用
    let calederData;
    // メインカレンダークラス
    class Calender {
        constructor(year, month) {
            this.year = year;
            this.month = month;
            this.firstDate;
            this.lastDay;
            this.firstDay;
        }
        get_Calender() {
            // 当月の最初の日を取得
            this.firstDate = new Date(this.year, (this.month - 1), 1);
            // 当月の最終日を取得
            this.lastDay = new Date(this.year, this.firstDate.getMonth() + 1, 0).getDate();
            // 当月の初日の曜日
            this.firstDay = this.firstDate.getDay();
            
            let oneWeekCnt = this.firstDay;

            // 一旦カレンダーデータをクリア
            calederData = [];
            // ｶﾚﾝﾀﾞﾃﾞｰﾀに日にちと曜日データを入れる
            for (let i = 0; i < this.lastDay; i++) {
                calederData.push({
                    day: i + 1,
                    weekday: oneWeekCnt,
                    value: days[oneWeekCnt][1],
                    month: this.month,
                    year: this.year
                });
                // 6=土曜日を週の最終日とする
                if (oneWeekCnt === 6) {
                    oneWeekCnt = 0;
                } else {
                    oneWeekCnt++;
                }
            }
            return calederData;
        }
        // カレンダデータを配置
        makeCalender() {
            const mkcl = new GenerateCalender(this.year, this.month, calederData);      
            mkcl.fillBlank();
            mkcl.deployCalender();
            mkcl.changeLabel();
        }
        // prev nextボタンで他の月を表示
        showOtherMonth() {
            const nxtprev = new NextAndPrev(this.year, this.month);
            nxtprev.changeMonth();
        }
        // jumpボタン
        jumpToAnymonth() {
            const jmpmth = new JumpToMonth();
            jmpmth.jump();
        }
    }

    // カレンダー作成クラス
    class GenerateCalender {
        constructor(year, month, calederData) {
            this.year = year;
            this.month = month;
            this.calederData = calederData;
        }
        // カレンダー上の初日より前、末日より後を埋める
        fillBlank() {
            // 初日より前の領域を空白で埋める
            for(let i = this.calederData[0].weekday; i > 0; i--) {
                this.calederData.unshift({
                    day: '',
                    weekday: i - 1,
                    value: days[i - 1][1],
                    month: this.month - 1,
                    year: this.year
                });
            }
            // 末日より後を埋める
            for(let i = this.calederData[this.calederData.length - 1].weekday; i < 6; i++) {
                this.calederData.push({
                    day: '',
                    weekday: i + 1,
                    value: days[i + 1][1],
                    month: this.month + 1,
                    year: this.year
                });
            }
        }
        // カレンダーの形式に配置
        deployCalender() {
            // 既にカレンダーが描画されている場合は削除
            if (document.querySelector('table')) {
                document.querySelector('table').remove();
            }
            // 表示先要素を取得
            let cTble = document.createElement('table');
            // 曜日部分
            let calTble = '<thead><tr>';
            for (const day of days) {
                // 土曜は青文字
                if (day[0] === 6) {
                    calTble += `<th>${day[1].fontcolor('#00f').fontsize(2)}</th>`;
                // 日曜は赤文字
                } else if (day[0] === 0) {
                    calTble += `<th>${day[1].fontcolor('#f00').fontsize(2)}</th>`;
                    // それ以外の曜日の場合は通常色  
                } else {
                    calTble += `<th>${day[1].fontsize(2)}</th>`;
                }
            }
            calTble += '</tr></thead>';

            // 日付部分
            calTble += '<tbody>';
            for (let i = 0; i < this.calederData.length; i++) {
                // Sunday（0番目）の手前で<tr>タグを作成
                if (this.calederData[i].weekday <= 0) {
                    calTble += '<tr>';
                } 
                // 本日日付はピンク色
                if (this.calederData[i].day === currentDate.getDate() 
                    && this.calederData[i].month === currentDate.getMonth() + 1
                    && this.calederData[i].year === currentDate.getFullYear() ){
                    calTble += `<td>${String(this.calederData[i].day).fontcolor('#f0f')}</td>`;  
                // それ以外の曜日の場合は指定色
                } else {
                    // 土曜日は青色
                    if (this.calederData[i].weekday === 6) {
                        calTble += `<td>${String(this.calederData[i].day).fontcolor('#00f')}</td>`;
                    // 日曜日は赤色
                    } else if (this.calederData[i].weekday === 0) {
                        calTble += `<td>${String(this.calederData[i].day).fontcolor('#f00')}</td>`;
                    // 平日はデフォルト色
                    } else {
                        calTble += `<td>${this.calederData[i].day}</td>`;
                    }
                } 
                // Saturday（6番目）の後で</tr>タグを作成
                if (this.calederData[i].weekday >= 6) {
                    calTble += '</tr>';
                } 
            }
            calTble += '</tbody>';
            cTble.innerHTML = calTble;
            dispContent.appendChild(cTble);
            
            return dispContent;
        }
        // ヘッダーの年月表示切り替え
        changeLabel() {
            header.innerHTML = `${this.year}年${this.month}月`;
        }        
    }

    // prev nextボタンでの再描画用クラス
    class NextAndPrev {
        constructor(year, month) {
            this.year = year;
            this.month = month;
        }
        changeMonth() {
            // nextボタン
            next.addEventListener('click', () => {  
                // 同年内
                if (this.month >= 1 && this.month < 12) {
                    this.month++;
                // 年跨ぎ
                } else if (this.month >= 12) {
                    this.year++;
                    this.month = 1;
                }
                console.log(new Calender(this.year, this.month).get_Calender());
                new Calender(this.year, this.month).makeCalender();
            });
            // prevボタン
            prev.addEventListener('click', () => { 
                // 同年内
                if (this.month >= 2 && this.month <= 12) {
                    this.month--;
                // 年跨ぎ
                } else if (this.month < 2) {
                    this.year--;
                    this.month = 12;
                }
                console.log(new Calender(this.year, this.month).get_Calender());
                new Calender(this.year, this.month).makeCalender();
            });
        }
    }
    
    // 指定した年月へジャンプ
    class JumpToMonth {
        constructor() {
            this.dateVal;
            this.year;
            this.month;
            this.day;
        }
        jump() {
            jump.addEventListener('click', () => {
                // 日付欄の値を取得
                this.dateVal = date.value;
                this.year = String(this.dateVal).substring(0, 4);
                this.month = String(this.dateVal).substring(5, 7);
       
                // 数値型に再変換
                this.year = Number(this.year);
                this.month = Number(this.month);

                console.log(new Calender(this.year, this.month).get_Calender());
                new Calender(this.year, this.month).makeCalender();
                
                new Calender(this.year, this.month).showOtherMonth();
            });
        }

    }

    // ロード時に実行
    window.onload = () => {
        // 現在の年月からカレンダーを生成
        const cldr = new Calender(currentYear, currentMonth);    
        // メソッドを実行
        console.log(cldr.get_Calender());
        cldr.makeCalender();
        cldr.showOtherMonth();
        cldr.jumpToAnymonth();
    }

}