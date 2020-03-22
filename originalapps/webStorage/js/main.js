'use strict';
{

    
    // ローカルストレージをセット
    localStorage.setItem('name', 'RK');
    localStorage.setItem('email', 'r.r.k.k.0@docomo.com');
    localStorage.setItem('address', 'Saitama Kasukabe-City');

    let btn = document.getElementById('btn');
    // console.log(localStorage.key(0));
    // console.log(localStorage.getItem('name'));

    // 一件ずつ表示
    function display() {
        let dispFlg = false;
        for (let i = 0; i<localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            // 一回目の表示のみタイトルを表示
            if (i === 0) {
                console.log('デフォルト');
            }
            console.log(`${key}: ${value}`);

            dispFlg = true;
        }
        if (!dispFlg) {
            console.log('全削除後');
            console.log('Nothing left');
        } 
    }
    display();

    // emailを削除
    // localStorage.removeItem('email');
    // display();


    // 全削除
    // localStorage.clear();
    // display();


    // ページ遷移させたい。。
    btn.addEventListener('click', ()=> {
        window.open('https://www.yahoo.co.jp', '_blank');
    });

}