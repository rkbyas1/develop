'use strict'

{
    let target = document.getElementById('inptxt');
    let input = document.getElementById('input');
    let inp = input.textContent;

    btn.addEventListener('click', function(){
        // inputタグの入力値を取得するときは、.valueを使う
        let str = target.value;
        // 正規表現オブジェクト
        let re = new RegExp('东');

        if (re.test(str)) {
            alert(`「${inp}」にエラー文字 ${re} が含まれています`);
        } else {
            alert("OK");
        }
    });


    // let array = [
    //     "いち",
    //     "に",
    //     "さん"
    // ];
    // delete array[1];
    // array = array.filter(item => {
    //     return item !== undefined;
    // });
    // array.forEach((el,index)=> {
    //     console.log(`${index}:${el}`);
    // });
    // console.log(array.length);

    const msg = 'ああああああ';

    Fnc(msg);
    function Fnc(msg) {
        console.log(msg + 'function1');
    }

    let hoge = function(msg) {
        console.log(msg + 'function2');
    }
    hoge(msg);
    
}