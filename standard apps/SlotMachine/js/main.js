'use strict';
 {
    //  panelクラスの属性を付与する
    class Panel {
        constructor(){
            // sectionタグの生成
            const sec = document.createElement('section');
            // クラスの付与
            sec.classList.add('panel');

            this.timeoutId = undefined;

            // imgはクラスのプロパティにする
            this.img = document.createElement('img');
            this.img.src = 'img/seven.png';

            // stopもクラスプロパティ
            this.stop = document.createElement('div');
            this.stop.textContent = 'STOP';
            this.stop.classList.add('stop', 'inactive');
            this.stop.addEventListener('click', () => { 
                // spin状態の場合のみstop処理を行う
                if (spin.classList.contains('hidden')) {
                    // 非活性のstopボタンは再度押下しても処理できないようにする
                    if (this.stop.classList.contains('inactive')) {
                        return;
                    } else {
                        // stopボタンを非活性にする
                        this.stop.classList.add('inactive');
                        // スロットを止める
                        clearTimeout(this.timeoutId);
                        // 動いているパネルを減らす
                        panelsLeft--;
                        // 止まったパネルを半透明にする
                        if (panelsLeft === 0) {
                            pointSum =  checkResult();
                            points.textContent = `${pointSum}ポイント獲得`;
                            debugger;
                            // try againボタンを表示
                            again.classList.remove('hidden');
                            onPlaying.classList.add('hidden');
                            // 残パネル数・spinクリック数をリセット
                            panelsLeft = panels.length;
                            spinClick = 0;
                        }
                    }
                //spin状態でない場合、stop処理は行わない 
                } else {
                    return;
                }                             
            });

            // imgとstopをセクションの子要素として追加
            sec.appendChild(this.img);
            sec.appendChild(this.stop);

            // sectionをメインに追加
            const main = document.querySelector('main');
            main.appendChild(sec);

        }
        getRandomImage(){
            const pics = [
                'img/seven.png',
                'img/cherry.png',
                'img/bell.png',
            ];    
            // 画像の一つをランダムに取得
            return pics[Math.floor(Math.random()*pics.length)];
                      
        }
        /**spinメソッド */
        spin() {
            this.timeoutId = setTimeout(() => {
                this.img.src = this.getRandomImage();
                this.spin();
            }, 80);           
        }
        isUnmatched(p1, p2) {
            // ture falseをそのまま返す
            let a = p1;
            let b = p2;
            debugger;
            // 条件式
            if (this.img.src !== p1.img.src && this.img.src !== p2.img.src && p1.img.src === p2.img.src) {
                return 1;
                // 全画像異なる場合は2を返す
            } else if (this.img.src !== p1.img.src && this.img.src !== p2.img.src && p1.img.src !== p2.img.src) {
                return 2;
            } else {
                return 3;
            }
        }
        unmatch() {
            this.img.classList.add('unmatched');
        }
        include() {
            return this.img.classList.contains('unmatched');
        }
        activate() {
            this.img.classList.remove('unmatched');
            this.stop.classList.remove('inactive');
        }
    }
    /**ここまでpanelクラス */

    /**最後のstopボタンを押した際にパネル判定 */
    // 他の2枚と異なる場合はグレーアウト
    function checkResult() {
        debugger;
        if(panels[0].isUnmatched(panels[1],panels[2]) === 1) {
            panels[0].unmatch();
            if(panels[0].include()) {
                debugger;
                return 2;
            } else {
                debugger;
                return 0;
            }           
        }
        if(panels[1].isUnmatched(panels[2],panels[0]) === 1) {
            panels[1].unmatch();
            if(panels[1].include())  {
                debugger;
                return 2;
            } else {
                return 0;
            }
        }
        if(panels[2].isUnmatched(panels[1],panels[0]) === 1) {
            panels[2].unmatch();
            if(panels[2].include())  {
                debugger;
                return 2;
            } else {
                debugger;
                return 0;
            }
        // 全画像異なる場合はグレーアウトポイント0
        } else if(panels[0].isUnmatched(panels[1],panels[2]) === 2){
            panels[0].unmatch();
            panels[1].unmatch();
            panels[2].unmatch();
            debugger;
            return 0;
        } else {
            return 3;
        }
    }
    // インスタンス生成
    const panels = [
        new Panel(),
        new Panel(),
        new Panel(),
    ];
    // 動いている残りのパネル
    let panelsLeft = panels.length;
    debugger;

    const points = document.getElementById('points');
    let point = 0;
    let pointSum = 0;

/**spinボタンの挙動 */
    const spin = document.getElementById('spin');
    const onPlaying = document.getElementById('onPlaying');
    onPlaying.classList.add('hidden');
    debugger;
    let spinClick = 0;
    
    spin.addEventListener('click', () =>  {
        FncSpin();
    });

    function FncSpin() {
        // 1回目のクリックでspinボタンを非表示にし、spin処理を行わないようにする
        spinClick++;
        spin.classList.add('hidden');
        onPlaying.classList.remove('hidden');
        point = 0;
        pointSum = 0;
        points.textContent = '';
        debugger;
        // spin.classList.add('spin');       
        if (spinClick === 1) {
            // panelsの画像を切り替える
            panels.forEach(panel => {
                panel.activate();
                panel.spin();
            });
            debugger;
        } else {
            debugger;
            return;
        }
        debugger;
    }

    /**Replayボタン */
    const again = document.getElementById('again');
    debugger;
    // 初期非表示
    again.classList.add('hidden');
    // クリック時
    again.addEventListener('click', () => {
        // spinと同様の処理を行う
        FncSpin();       
        // クリック後に非表示にする
        again.classList.add('hidden');
    });






}