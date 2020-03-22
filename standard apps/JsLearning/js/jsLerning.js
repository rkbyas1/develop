'use strict';
{

/**クラスとオブジェクトの概念 */
// 親クラス
// class Player {
//     // オブジェクトごとに異なる値をプロパティに設定
//     constructor(name, score) {
//         // インスタンスに引数の値をセット
//         this.name = name;
//         this.score = score;
//     }

//     showInfo() {
//         console.log(this.name);
//     }

//     showVersion() {
//         // staticメソッドのため、以下のthisには”Player”が入る、静的プロパティ
//         // インスタンスからは呼び出されない
//         console.log(`${this.name}:ver1.0`);
//     }
// }
// Playerクラスの内容を引き継いだSoccerPlayerクラス
// 子クラス
// class SoccerPlayer extends Player{
//     constructor(name, score, number) {
//         // 親クラスコンストラクタを呼ぶ（nameとscorwをプロパティにセットする）
//         super(name,score);
//         // numberのセット
//         this.number = number;
//     }
//     kick() {
//         console.log(`${this.number}番のGoooaaal!!`);
//     }
// }

// クラスに値を渡すオブジェクト（インスタンス）を作成 Playerの構造にする
// const taguchi = new Player('taguchi', 90);
// const RK = new Player('RK', 20);

// オブジェクトとして呼び出す
// console.log(RK.score);
// // RKのshowInfoオブジェクトを呼び出す
// RK.showInfo();
// // staticメソッドを呼び出す
// taguchi.showVersion();

// const tsubasa = new SoccerPlayer('tsubasa','99', 10);
// tsubasa.kick();
// console.log(tsubasa.number);
// tsubasa.showInfo();

// const ar = [1,3,4];
// const b = ar.filter( item => item%2 === 0);
// console.log(b);

// const o = {
//     a:1,
//     b:2
// };

/**オブジェクト */
// console.log(Object.keys(o));
// console.log(Object.values(o));
// console.log(Object.entries(o));

// Object.keys(o).forEach(key => {
//     console.log(`${key}:${o[key]}`);
// });
// Object.entries(o).forEach(value => {
//     console.log(`${value}`);
// });

/**分割代入 */
// const pler = {name:'RK',age:27,position:'franker',height:195}
// const{name, age, ...other} =pler;
// console.log(name);
// console.log(age);
// console.log(other);

/** stringについて */
// const line = "hello";
// console.log(line.length);
// console.log(line.substring(2,4));
// console.log(line[1]);

/** Math */
// console.log(Math.PI);
// console.log(Math.floor(Math.random()*6+1));

/** date */
// const date = new Date(2019,8,31);
// const date1 = new Date(2019,10,21);
// console.log(`${date.getFullYear()}年${date.getMonth()}`);
// console.log((date1-date)/(24*60*60*1000));
// date.setHours(13,20,24);
// date.setDate(32);
// date.setDate(date.getDate() + 3);
// console.log(date);

// let year = date.getFullYear();
// let month = date.getMonth()+1;
// let day = date.getDate();
// console.log(`${year}年${month}月${day}日`);

// console.log(date);
// console.log(date.getFullYear());
// console.log(date.getMonth());
// console.log(date.getDate());
// console.log(date.getDay());
// console.log(date.getHours());
// console.log(date.getMinutes());
// console.log(date.getSeconds());
// console.log(date.getUTCMilliseconds());

/**windowオブジェクト */
// window.addEventListener('click', () => {
//     alert("アラートメッセージ");
// });
// const flgs = [];
// let fls = 0;
// window.addEventListener('dblclick', () => {
//     const msgflg = confirm("ダブルクリックしました");
//     console.log(msgflg);

//     flgs.push(msgflg);
//     console.log(flgs);

//     if (flgs.includes(false)) {
//         fls++;
//         if (fls > 2) {
//             alert('リロードしてやり直してください');
//         }
//     }
//     console.log(fls);
// });

/** 繰り返し処理setInterval */
// const array = [];
// const showTime = () => {
//     console.log(new Date());
//     array.push(res);
//     if (array.length > 2) {
//         clearInterval(res);
//     }
// };
// let res = setInterval(showTime, 1000);


/** 繰り返し処理setTimeout */
// let i = 0;
// const showDate = () => {
//     console.log(new Date());
//     let timeoutId = setTimeout(showDate,1000);
//     i++;
//     if (i > 4) {
//         clearTimeout(timeoutId);
//     }
// };
// showDate();

/** 例外処理 */
// try {
//     const a = 4;
//     console.log(a.toUpperCase());   
// } catch (ex) {
//     console.log(`${ex.message}の例外発生`);
// } 
// console.log("Finish");


// 

// 親クラス
    class Post {
        constructor(text) {
            this.text = text;
            this.likeCount = 0;
        }
        show() {
            console.log(`${this.text} ${this.likeCount} likes`)
        }
        like() {
            this.likeCount++;
            this.show();
        }
        // 静的メソッド
        static showInfo() {
            console.log('version 1.0');
        }

    }
    //  子クラス
    class SponsoredPosts extends Post{
        constructor(text, sponsor) {
            //親クラスコンストラクタを呼ぶ
            super(text);
            this.sponsor = sponsor;
        }
        show() {
            // 親クラスメソッドを呼ぶ
            super.show();
            console.log(`...sponsored by ${this.sponsor}`);
        }
        // 静的メソッド
        static showInfo() {
            console.log('version 1.0');
        }

    }
    
    const posts = [
        new Post('JS勉強'),
        new Post('楽しいプログラミング') ,
        new SponsoredPosts('3分動画でマスター', 'dotInstall')     
    ];

    // posts.forEach(post => {
    //     post.like();
    // });

    // Post.showInfo();

    // posts[2].show();
    // posts[2].like();

    /**日時 */
    // 現在日時
    
    
    function dispDate() {
        const d = new Date();
        console.log(`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日${d.getHours()}時${d.getMinutes()}分${d.getSeconds()}秒`);

    }
    // setInterval(() => {
    //     dispDate();
    // }, 1000);

    const cd = new Date();
    console.log(cd.getTime());

}
