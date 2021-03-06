'use strict';
{
    /** 変数・定数定義 */
    const draggable = document.getElementById('draggableItems');
    const dropbox = document.getElementById('dropbox');
    const msg = document.getElementById('msgspan');
    let droppedItem = '';
    let img = '';
    let index = 0;
    // 実行済みフラグ
    let exFlg = false;

    /** フォルダ内にあるピクチャをpictures配列に格納 */
    let pictures = [
        {id:'item0', src:'img/apple.png', alt:'apple'},
        {id:'item1', src:'img/cat.png', alt:'catface'},
        {id:'item2', src:'img/cat2.png', alt:'cat'},
        {id:'item3', src:'img/louvel.png', alt:'louvel'},
        {id:'item4', src:'img/night.png', alt:'night'},
        {id:'item5', src:'img/eclipse.png', alt:'eclipse'},
    ];

    /** pictures配列をランダムシャッフル */
    /** (Fisher–Yates フィッシャー・イェーツ　シャッフルアルゴリズム) */
    for (let i = pictures.length-1; i>0; i--) {
        let r = Math.floor(Math.random()*(i+1));
        let tmp = pictures[i];
        pictures[i] = pictures[r];
        pictures[r] = tmp;
    }

    /** ランダム抽出された配列をselected配列に格納 */
    let selected = randomExtract(pictures, 4);

    /** selected配列から欲しい画像（移動したい画像）をランダムに抽出 */
    let wantOne = selected[Math.floor((Math.random())*(selected.length))];
    /** 欲しい画像を文章中に表示する */
    let keyWord = document.getElementsByClassName('choiced')[0];
    // キーワードにはpicのalt属性を表示
    keyWord.innerHTML = wantOne.alt;

    /** ランダムに4つ抽出する関数 */
    function randomExtract(array, num) {
        let slctdAry = [];
        array.forEach((pic,index)=> {
            if(index < num) {
                // 抽出したpictureを格納
                slctdAry.push(pic);
            }
            return;
        });
        // 抽出したpictureを返す
        return slctdAry;
    }

    /** 抽出したselected配列の中身をimgタグに表示する */
    function display(exFlg,selected) {
        for (const sel of selected) {      
            img = document.createElement('img');
            // imgタグにdraggable属性を追加
            // exFlgがtrueならimg.draggableもfalseにする
            if (exFlg) {
                img.draggable = false;
                // draggable.removeChild(img);
            }
            // imgタグの追加
            draggable.appendChild(img);
            // imgタグの中身にpicのsrc属性とalt属性を追加
            img.src = sel.src;
            img.alt = sel.alt;
            // ドラッグ対象の画像に取得にidとindexを設定
            img.id = `imgs${index}`;
            index++;
            // imgのドラッグイベント
            img.addEventListener('dragstart', event => {
                // ドラッグした要素にtext型のidをdataTransferに持たせる
                event.dataTransfer.setData('text', event.target.id);
            });
        }
    }
    display(exFlg,selected); 
    
    dropbox.addEventListener('dragenter', event => {
        event.preventDefault();
    });
    // オブジェクトがdropboxオブジェクト上にある時にドロップ可能となる
    dropbox.addEventListener('dragover', event => {
        event.preventDefault();
    });

    /** 一度ドラッグ&ドロップしたら残りのimgはドラッグ不可とする処理 */
    function onceDragged() {    
        // 実行済フラグをtrueにする 
        exFlg = true;
        // 選んだものとselected内のもので一致しているものはselectedから削除
        selected.forEach((sel,index) => {              
            if (sel.alt === droppedItem.alt) {                      
                // 配列から要素を削除
                delete selected[index];
            } else {
                // 画面上から他の要素を削除
                img = document.getElementById(`imgs${index}`);
                draggable.removeChild(img);           
            }
        });
        // 削除された要素を除いた配列を再生成
        selected = selected.filter(item => {
            return item.id !== undefined;
        });  
        // 配列を返す 
        return selected;     
    }

    /** ドロップイベント */
    dropbox.addEventListener('drop', event => {
        event.preventDefault();
        // dataTransferが持つデータを取得
        let id = event.dataTransfer.getData('text');
        // ドロップされたアイテムをimg要素のidから取得
        droppedItem = document.getElementById(id);
        // dropboxにドロップされたアイテムを追加  
        dropbox.appendChild(droppedItem);

        /** 文章のドラッグ対象と実際にドラッグしたimgが一致した場合*/ 
        if (droppedItem.alt === wantOne.alt) {
            debugger;
            msg.innerHTML = `OK! ${wantOne.alt}が正しく選択されました`;          
            // onceDraggedで作った配列を受け取る
            selected = onceDragged();
            // 1要素削除ごの配列の中身をimgタグに表示する
            display(exFlg,selected);
        
        /** 不一致の場合 */
        } else {
            msg.innerHTML = `NG! それは${droppedItem.alt}なので正しくありません`; 
            // onceDraggedで作った配列を受け取る
            selected = onceDragged();
            // 1要素削除ごの配列の中身をimgタグに表示する
            display(exFlg,selected);
        }
    });
}

