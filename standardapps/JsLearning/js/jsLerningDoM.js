'use strict';
{
/** getElementById */
// let target = document.getElementById('target');
// target.textContent = 'changed';

/** querySelector */
// document.querySelector('h1').textContent = 'チェンジ';
// document.querySelectorAll('li:nth-child(even)').forEach(li => {
//     li.textContent = 'lis';
// });
//  const ul = document.querySelector('ul');
//  console.log(ul.parentNode);
//  console.log(ul.children[2]);
// for (let i = 0; i<ul.children.length; i++) {
//     console.log(ul.children[i]);
// }
//  const h1 = document.querySelector('h1');
// h1.style.color = 'gray';
// h1.style.backgroundColor = 'red';
// console.log(h1.dataset.apid);
// h1.dataset.apid = 'this is custom MSG';

/** classList */
//  const div = document.querySelector('div');
// div.className = 'box border-pink';
// div.classList.add('border-pink');


// window.addEventListener('dblclick', ()=> {
//     if (div.classList.contains('box') ) {
//         alert('boxクラスを外しました');
//         div.classList.remove('box');
        
//     } else {
//         alert('boxクラスを追加しました');
//         div.classList.add('box');
        
//     }
//      div.classList.toggle('box');
// })

/**要素の生成・削除 */
// const h1 = document.createElement('h1');
// h1.textContent = 'Title';
// document.body.appendChild(h1);

// const p = document.createElement('p');
// p.textContent = 'Pタグ';
// document.body.appendChild(p);

// const h2 = document.createElement('h2');
// h2.textContent = 'Sub Title';
// document.body.insertBefore(h2,p);

// const copy = p.cloneNode(true);
// document.body.insertBefore(copy,h2);

// document.body.removeChild(h2);

/**フォーム部品の操作 */
// const text = document.querySelector('input');
// const textarea = document.querySelector('textarea');

// text.value = 'ちぇんじばりゅー';
// console.log(text.value);
// console.log(textarea.value);

//  text.select();
// text.disabled = true;

// console.log(document.querySelectorAll('input')[0].checked);
// console.log(document.querySelectorAll('input')[1].checked);
// document.querySelectorAll('input')[0].checked = true;

// console.log(document.querySelectorAll('input[type="radio"]')[0].checked);
// document.querySelectorAll('input[type="radio"]')[1].checked = true;
// console.log(document.querySelectorAll('input[type="radio"]')[1].checked);

// console.log(document.querySelectorAll('select>option')[0].selected);
// console.log(document.querySelectorAll('select>option')[1].selected);
// console.log(document.querySelectorAll('select>option')[2].selected);
// document.querySelectorAll('select>option')[0].selected = true;

/**イベント */
// let div = document.querySelector('div');
// window.addEventListener('mousemove', e => {
//     div.textContent = `${e.clientX}:${e.clientY}におる`
// });

/**preventDefault */
// const a = document.querySelector('a');
// const span = document.querySelector('span');

// a.addEventListener('click', e => {
//     e.preventDefault();
//     a.classList.add('hidden');
//     span.classList.remove('hidden');
// });


/**オブジェクト配列 */
let obarr = {
    name: "AAA",
    nikname: {
        anik: "kohno",
        bnik: "taroh"
    },
    location: "CCC",
};


console.log(obarr['nikname'].bnik);
let tojson = JSON.stringify(obarr);

console.log(tojson);

// jsに変換してlocationを削除し、再度json形式に戻す
let tojs = JSON.parse(tojson);
delete(tojs['location']);
console.log(tojs);
tojson = JSON.stringify(tojs);
console.log(tojson);

// for(let key in tojson) {
//     if(tojson.hasOwnProperty(key)){
//         console.log(key);
//         console.log(tojson);
//     }
// }


}