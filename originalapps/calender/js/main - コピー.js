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
    let dispContent = document.getElementById('calendar');

    class Calender {
        constructor(year, month) {
            this.year = year;
            this.month = month;
            this.firstDate;
            this.lastDay;
            this.firstDay;
            this.calederData = [];
        }
        get_Calender() {
            // 当月の最初の日を取得
            this.firstDate = new Date(this.year, (this.month - 1), 1);
            // 当月の最終日を取得
            this.lastDay = new Date(this.year, this.firstDate.getMonth() + 1, 0).getDate();
            // 当月の初日の曜日
            this.firstDay = this.firstDate.getDay();
            
            let oneWeekCnt = this.firstDay;

            for (let i = 0; i < this.lastDay; i++) {
                // ｶﾚﾝﾀﾞﾃﾞｰﾀに日にちと曜日データを入れる
                this.calederData.push({
                    day: i + 1,
                    weekday: oneWeekCnt,
                    value: days[oneWeekCnt][1]
                });
                // 6=土曜日を週の最終日とする
                if (oneWeekCnt === 6) {
                    oneWeekCnt = 0;
                } else {
                    oneWeekCnt++;
                }
            }
            return this.calederData;
        }
        makeCalender() {
            const mkcl = new GenerateCalender(this.year, this.month, this.calederData);
            mkcl.fillBlank();
            mkcl.deployCalender();
        }

    }

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
                    value: days[i - 1][1]
                });
            }
            // 末日より後を埋める
            for(let i = this.calederData[this.calederData.length - 1].weekday; i < 6; i++) {
                this.calederData.push({
                    day: '',
                    weekday: i + 1,
                    value: days[i + 1][1]
                });
            }
        }
        // カレンダーの形式に配置
        deployCalender() {
            let cTble = document.createElement('table');

            // 曜日部分
            let calTble = '<thead><tr>';
            for (const day of days) {
                calTble += `<th>${day[1]}</th>`;
                if (day[0] === 6) {
                    cTble.style.color = '#00f';
                    // let dcls = document.querySelector('th');
                    // dcls.style.color = '#00f';
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
                calTble += `<td>${this.calederData[i].day}</td>`;
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
    }
    
    // 現在の年月からカレンダーを生成
    const currentDate = new Date();
    const cldr = new Calender(currentDate.getFullYear(), currentDate.getMonth() + 1);    
    console.log(cldr.get_Calender());
    cldr.makeCalender();






}