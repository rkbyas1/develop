'use strict';

{
    // 画像データを配列で保持
    const images = [
        'img/pic00.png',
        'img/pic01.png',
        'img/pic02.png',
        'img/pic03.png',
        'img/pic04.png',
        'img/pic05.png',
        'img/pic06.png',
        'img/pic07.png',   
    ];

    // 今何番目の画像を表示しているか
    let currentNum = 0;

    // メイン画像をサムネに表示する関数
    function setMainImage(image){
        // main imgタグのsrc属性にimageを設定
        document.querySelector('main img').src = image;
    }
    // currentNum番目の画像を表示
    // main imgタグのsrc属性に現在の番号の画像を設定
    setMainImage(images[currentNum]);

    // li要素のcurrentNum番目からcurrentクラスを取り除く
    function removeCurrentclass() {
        document.querySelectorAll('.thumbnails li')[currentNum]
        .classList.remove('current');
    }
    // 更新されたcurretNum番目クラスにcurrentクラスを付加
    function addCurrentClass() {
        document.querySelectorAll('.thumbnails li')[currentNum]
        .classList.add('current');
    }
    // サムネイルクラスを取得し、領域を確保
    const thumnails = document.querySelector('.thumbnails');
    // imagesを数分取得してliに追加(num=配列番号)
    images.forEach((image, num) => {
        // li要素とimage要素を生成
        const li = document.createElement('li');
        // numとcurrentNumが等しければ濃くなるスタイルを適用
        if (num === currentNum) {
            li.classList.add('current');
        }
        // サムネをクリックしたらメインに表示する
        li.addEventListener('click', ()=> {
            setMainImage(image);
            // Currentクラスを取り除く
            removeCurrentclass();
            // 現在の番号を更新
            currentNum = num;
            // 最新のcurrentNumの画像にcurrentクラスを付加
            addCurrentClass();
        });
        const img = document.createElement('img');
        // <img src=画像（image）>のタグを作り、画像を挿入
        img.src = image;
        // imgをli子要素として追加
        // <li><img src=画像（image）></li>の形にする
        li.appendChild(img);
        // liを子要素として追加（thumnailsクラスの下にliを配置する）
        thumnails.appendChild(li);
    });

    // nextボタンの挙動
    const next = document.getElementById('next');
    next.addEventListener('click', () => {     
        removeCurrentclass();
        currentNum++;
        // 最後の画像まで行ったら最初の画像に戻る
        if (currentNum === images.length) {
            currentNum = 0;
        }
        addCurrentClass();
        setMainImage(images[currentNum]);     
    });

    // prevボタンの挙動
    const prev = document.getElementById('prev');
    prev.addEventListener('click', () => {     
        removeCurrentclass();
        currentNum--;
        // 最初の画像より前になったら最後の画像へ
        if (currentNum < 0) {
            currentNum = images.length-1;
        }
        addCurrentClass();
        setMainImage(images[currentNum]);     
    });

    // setTimeoutの戻り値
    let timeoutId;

    function playSlideshow(){   
        timeoutId = setTimeout(() => {
            // 次のスライドへ行くnext処理をクリック時に実行
            next.click();
            playSlideshow();
            // 0.5秒ごとに切り替え
        }, 500);
    }
    // play,pauseボタン
    const play = document.getElementById('play');
    const pause = document.getElementById('pause');
    play.addEventListener('click', () => {
        // playボタンを隠す     
        play.classList.add('hidden');
        // pauseボタンを表示する     
        pause.classList.remove('hidden');
        // 一定時間ごとに画像を切り替える
        playSlideshow();         
    });

    pause.addEventListener('click', () => {
        // playボタンを表示する    
        play.classList.remove('hidden');
        // pauseボタンを隠す   
        pause.classList.add('hidden'); 
        // 現在の位置で画像を止める   
        clearTimeout(timeoutId);
    });
}