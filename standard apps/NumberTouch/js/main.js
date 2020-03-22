'use strict';

{
class Panel {
    constructor(value) {
        // gameクラスのメソッドを使えるようにする
        this.value = value;

        this.li = document.createElement('li');
        this.li.classList.add('pressed');
        this.li.addEventListener('click', ()=> {
            this.check();
            // 最後のボタンを押したらカウント停止
            // 結果欄を表示する
            if(this.value.getCurrentNum() === this.value.setLevel()) {
                clearTimeout(this.value.getTimeoutId());
                const retValue = this.value.showResult();
                let label = this.value.getstopTime();
                retValue.innerHTML = `記録 ${label}秒`;
            }
        });
    }
    getLi(){
        return this.li;
    }
    // パネルをアクティブにする
    activate(num) {
        this.li.classList.remove('pressed');
        this.li.innerHTML = num;
    }
    check() {
        if(this.value.getCurrentNum() === parseInt(this.li.innerHTML,10)) {
            this.li.classList.add('pressed');
            this.value.addCurrentNum();
        }
    }

}
class Board {
    constructor(value) {
        this.value = value;
        this.panels = [];     
        for (let i = 0; i < this.value.setLevel(); i++) {
            this.panels.push(new Panel(this.value));
            
        }

        const board = document.getElementById('board');
        this.panels.forEach(panel => {
            board.appendChild(panel.getLi());
        });

    }
    // 4つ分のパネルをアクティブにする
    activate() {
        const arr = [];
        for (let i = 0; i < this.value.setLevel(); i++) {
            arr.push(i);
        }

        this.panels.forEach(panel => {  
             //arr配列から要素を一つ取り出してindexに代入
            //  arr配列からはループごとに要素が一つずつなくなる 
            const index = arr.splice(Math.floor(Math.random()*arr.length), 1)[0];
            panel.activate(index);
        });
    }
}
class Game {
    constructor() {
        this.level = Math.floor(Math.random()*25) + 1;
        this.board = new Board(this);
        
        this.currenNum = undefined;
        this.startTime = undefined;
        this.timeoutID = undefined;
        this.result = document.getElementById('result');
        this.count = document.getElementsByClassName('count');
           
        /**ボタンの挙動設定 */
        const start = document.getElementsByClassName('start');
        start[0].addEventListener('click', () => {
            // タイマー動作中であればタイマーをリセット 
            if (typeof this.timeoutID !== 'undefined'){
                clearTimeout(this.timeoutID);
            }
            this.begin()
            .then(event => {
                this.board.activate();
                // alert(event);
                console.log(event);
            })
            .catch(event => {
                console.log(event);
                return;
            })
            // タイマーをスタート   
            this.startTime = Date.now();
            this.countUp()
            .then( event => {
                console.log(event[1]);
            })    
            this.currenNum = 0;
            this.hideResult();
        });
    this.setup();
    // レベルチェンジボタン
    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', ()=> {
        window.location.reload();
    });
    // 現在のレベルを表示
    const displevel = document.getElementById('displevel');
    displevel.innerHTML = `Level:${this.level}`;
    }
    setup() {
        const container = document.getElementsByClassName('container');
        // 50pxをthis.level分表示
        const PANEL_WIDTH = 50;
        const BOARD_PADDING = 10;
        container[0].style.width = PANEL_WIDTH*this.level+BOARD_PADDING*2+'px'
    }
    begin() {
        return new Promise((resolve, reject) => {
            // 正常に処理された場合に返すMSG
            resolve('the boards were activated');
            // エラー時に返すMSG
            reject('ERROR!');
        });
    }
    
    countUp () {
        return new Promise((resolve,reject) => {
            this.count[0].innerHTML = ((Date.now() - this.startTime) / 1000 ).toFixed(2);
            this.timeoutID = setTimeout( () => {
                resolve([this.countUp(),'count started']);
            }, 20); 
        });
    }
    getCurrentNum() {
        return this.currenNum;
    } 
    addCurrentNum() {
        this.currenNum++;
    }
    getTimeoutId() {
        return this.timeoutID;
    }
    hideResult () {
        this.result.classList.add('hidden');
    }
    showResult() {
        this.result.classList.remove('hidden');
        return this.result;
    }
    getstopTime() {
        return this.count[0].innerHTML;
    }
    setLevel() {
        return this.level;
        
    }
}

new Game();


}