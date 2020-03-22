'use strict';
{
    let previewAarea, fileField;

    // 画像配置エリア
    previewAarea = document.getElementById('preview-area');
    // ファイル名表示エリア
    fileField = document.getElementById('file-field');


    function appendImage(file) {
        debugger;
        // 変数宣言
        let item, image, description, reader;
        // ノードタグ（要素）を生成
        item = document.createElement('li');
        image = document.createElement('img');
        description = document.createElement('dl');
        // ファイル名を表示
        description.innerHTML =
            `ファイル名：${file.name}`;

        // プレビューエリアに要素を配置
        item.appendChild(image);
        item.appendChild(description);
        previewAarea.appendChild(item);

        // ファイルオブジェクト取得
        reader = new FileReader();
    
        // loadイベントは文書をロードするときに実行される
        // ここでは、画像を表示するとき
        reader.addEventListener('load', event => {
            debugger;
            // ここで画像を表示
            image.src = event.target.result;
        });
        // データURLとして画像を読み込む
        reader.readAsDataURL(file);
    }

    // 複数ファイルが選択された場合はひとつずつappendImageする
    function appendAllImages(files) {
        // ファイル名欄は最初は空欄
        previewAarea.innerHTML = '';
        debugger;

        for(let f of files) {
            appendImage(f);
            console.log(f);
        }
    }

    previewAarea.addEventListener('dragover', event => {
        event.preventDefault();
    });

    // previewAarea.addEventListener('drop', event => {
    //     event.preventDefault();
    //     appendAllImages(event.dataTransfer.files);
    //     debugger;
    // });

    // changeイベントは要素が変更されたときに実行される
    // ここでいうと、ファイル選択ボタンダイアログで画像選択してOK押下した際
    fileField.addEventListener('change', event => {
        appendAllImages(fileField.files);
        debugger;
    });

    console.log(fileField.files);


}