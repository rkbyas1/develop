(function () {
    // リストの取得など
    const todosList = document.getElementById('todosList');
    const appsList = document.getElementById('appsList');
    const blogsList = document.getElementById('blogsList');
    const wannabuyList = document.getElementById('wannabuyList');

    const contents = document.getElementById('contents');
    let li;
    let isEdited = false;

    // 初期描画処理
    renderData();
    
    // 描画用関数
    function renderData() {
        // JSのオブジェクト形式に変換して取得
        const getData = JSON.parse(localStorage.getItem('mytasks'));
        if (getData != null) {
            // 再描画する
            for (const val of getData) {
                switch (val.category) {
                    case "todos":
                        appendNode(val, todosList);
                        break;
                    case "apps":
                        appendNode(val, appsList);
                        break;
                    case "blogs":
                        appendNode(val, blogsList);
                        break;
                    case "wannabuy":
                        appendNode(val, wannabuyList);
                        break;
                }
            }
        }
    }

    function appendNode(val, ulList) {
        li = document.createElement('li');
        // 再描画時にチェックを入れたり、スタイルを整えたり
        if (val.isCompleted) {
            li.classList.add("completed")
        }
        let checkHtml = val.isDone == true ? `<input type="checkbox" class=${val.category} checked>` : `<input type="checkbox" class=${val.category}>`;
        const inp = checkHtml + val.title;
        const label = document.createElement('label');
        label.className = val.category;
        label.innerHTML = inp;
        
        // リストを完成させる
        li.appendChild(label);
        ulList.appendChild(li);
    }
   
    // タスク追加関数
    function addTask(ulList, classNm) { //対象ulリスト、クラス名
        // 入力値が空白なら何も追加しない
        if (contents.value == "" || contents.value == null ) {
            alert("追加する内容を入力してください");
            return;
        }
        // 入力値を取得＆liタグを作成
        const inpData = contents.value;
        li = document.createElement('li');
        
        // チェックボックスのinputタグと入力値を結合し、ラベル内に反映
        const inp = `<input type="checkbox" class=${classNm}>` + inpData;
        const label = document.createElement('label');
        label.className = classNm;
        label.innerHTML = inp;
        
        // リストを完成させる
        li.appendChild(label);
        ulList.appendChild(li);

        // input欄を空白にする
        contents.value = "";
    }

    // 分類を判定する関数
    function classfyCategories() {
        const categories = document.getElementsByName('category');
        for (const name of categories) {
            // どの分類に追加するのかを判定
            if (name.checked) {
                switch (name.id) {
                    case 'todos':
                        addTask(todosList, "todos");
                        break;
                    case 'apps':
                        addTask(appsList, "apps");
                        break;
                    case 'blogs':
                        addTask(blogsList, "blogs");
                        break;
                    case 'wannabuy':
                        addTask(wannabuyList, "wannabuy");
                        break;
                }
            }
        }
    }

    // アイテム削除用関数
    function deleteItem() {
        const li = document.querySelectorAll('li');
            // メッセージで削除確認
        if (confirm("Are You Sure to Delete Items?")) {
            if (li != null) {
                for (let i = 0; i < li.length; i++) {
                    if (li[i].classList.contains('completed')) {
                        // リストの入れ替え
                        const prt = li[i].parentElement;
                        prt.removeChild(li[i]);
                    }
                }
            }
        }
        // ローカルストレージの入れ替え
        let storageData = JSON.parse(localStorage.getItem('mytasks'));
        storageData = storageData.filter(val => {
            return !val.isCompleted;
        });
        localStorage.setItem('mytasks', JSON.stringify(storageData));
    }

    // 保存処理
    function save() {
        const input = document.querySelectorAll('input.todos, input.apps, input.blogs, input.wannabuy');
        const label = document.querySelectorAll('label.todos, label.apps, label.blogs, label.wannabuy');
        registStorage(input, label);
    }
    // ストレージ登録
    function registStorage(lists, label) {
        const li = document.querySelectorAll('li');
        const storageList = [];
        let compFlg = false;
        let category = ""
        // カテゴリ別登録
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].classList.contains("todos")) {
                category = "todos";
            }
            if (lists[i].classList.contains("apps")) {
                category = "apps";
            }
            if (lists[i].classList.contains("blogs")) {
                category = "blogs";
            }
            if (lists[i].classList.contains("wannabuy")) {
                category = "wannabuy";
            }
            li[i].classList.contains("completed") ? compFlg = true : compFlg = false;
            storageList.push({title:label[i].innerText, isDone:lists[i].checked, isCompleted:compFlg, category:category});
            // json→文字列形式に変換して保存
            localStorage.setItem('mytasks', JSON.stringify(storageList));
        }
    }


    // 編集用関数
    function editItem() {
        const input = document.querySelectorAll('input.todos, input.apps, input.blogs, input.wannabuy');
        const label = document.querySelectorAll('label.todos, label.apps, label.blogs, label.wannabuy');
        const li = document.querySelectorAll('li');
        let loopExit = false;
        let cnt = 0;

        for (let i = 0; i < input.length; i++) {
            if (!loopExit) {
                // チェックあり且つ未完了のものを最初の1件だけ編集可能とする
                if (!li[i].classList.contains("completed") && input[i].checked) {
                    contents.value = label[i].innerText;
                    // 編集中フラグをオンにし、EDITボタン→UPDATEボタンに変更
                    isEdited = true;
                    document.getElementById('edit').innerHTML = "UPDATE";
                    loopExit = true;
                    cnt++;
                }
            }
        }
        if (cnt == 0) {
            alert("編集したい内容を選択してね");
        }
    }
    // 更新用関数
    function updateItem() {
        const input = document.querySelectorAll('input.todos, input.apps, input.blogs, input.wannabuy');
        const label = document.querySelectorAll('label.todos, label.apps, label.blogs, label.wannabuy');
        const li = document.querySelectorAll('li');
        let loopExit = false;
        let cnt = 0;

        // 入力値が空白なら何も追加しない
        if (contents.value == "" || contents.value == null ) {
            alert("更新する内容を入力してね");
            return;
        }
        for (let i = 0; i < input.length; i++) {
            if (!loopExit) {
                // チェックあり且つ未完了の最初の1件のliを取得し、値を入れ替える
                if (!li[i].classList.contains("completed") && input[i].checked) {
                    const inp = `<input type="checkbox" class=${label[i].className} checked>` + contents.value;
                    label[i].innerHTML = inp;
                    // input欄をクリア
                    contents.value = "";

                    // 編集中フラグをオフにし、UPDATEボタン→EDITボタンに変更
                    isEdited = false;
                    document.getElementById('edit').innerHTML = "EDIT";
                    loopExit = true;
                    cnt++;
                }
            }
        }
        if (cnt == 0) {
            alert("更新対象のリスト1つ選択してね");
        }
    }

    // ADDボタンでtodoを追加
    document.getElementById('add').onclick = () => {
        classfyCategories(); //分類判定して追加
        save();
    }
    // SAVEボタン
    document.getElementById('save').onclick = () => {
        save();
        alert("保存しました");
    }

    // COMPLETEボタンでtodoを完了
    document.getElementById('comp').onclick = () => {
        const lists = document.querySelectorAll('input.todos, input.apps, input.blogs, input.wannabuy');
        const li = document.querySelectorAll('li');

        for (let i = 0; i < lists.length; i++) {
            if (lists[i].checked) {
                li[i].classList.add('completed');
            }
        }   
        save();
    }
    // REGENERATEボタンで完了したTODOを復活
    document.getElementById('reg').onclick = () => {
        const lists = document.querySelectorAll('input.todos, input.apps, input.blogs, input.wannabuy');
        const li = document.querySelectorAll('li');

        for (let i = 0; i < lists.length; i++) {
            if (lists[i].checked && li[i].classList.contains('completed')) {
                li[i].classList.remove('completed');
            }
        }   
        save();
    }
    // DELETEボタンでチェックしたtodoを削除
    document.getElementById('del').onclick = () => {
        deleteItem();
    }
    // EDIT
    document.getElementById('edit').onclick = () => {
        // 編集中でなければ編集できるよう処理
        if (!isEdited) {
            editItem();
        // 編集中であれば編集不可、updateのみ可能
        } else {
            updateItem();
        }
    }


}());