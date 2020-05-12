'use strict';

// 即時関数で囲う
( () => {
    // Clockdrawerクラス
    class Clockdrawer {
        constructor(canvas) {
            // プロパティ
            this.ctx = canvas.getContext('2d');
            this.width = canvas.width;
            this.height = canvas.height;
        }
        draw(angle, fnc) {
            // 描画開始地点をリセット
            this.ctx.save();
            // 描画開始地点を時計の真中へ移動
            this.ctx.translate(this.width/2, this.height/2);
            this.ctx.strokeStyle = '#000000';
            this.ctx.rotate(angle/180 * Math.PI);

            this.ctx.beginPath();
            // 盤面描画処理
            fnc(this.ctx);
            this.ctx.stroke();

            this.ctx.restore();
        }
        clear() {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }
    // Clockクラス
    class Clock {
        // Clockdrawerクラスを取得
        constructor(clockdrawer) {
            // 半径
            this.r = 110;
            // clockdrawerインスタンスを取得
            this.drawer = clockdrawer;
        }
        drawFace() {
            for (let angle = 0; angle<360; angle += 6) {
                this.drawer.draw(angle, ctx => {
                    // 中心より真上の点に移動し、そこを0として描画開始
                    ctx.moveTo(0, -this.r);
                    // 5分目盛りごとに太く長く描画
                    if (angle % 30 === 0) {
                        ctx.lineTo(0, -this.r + 10);
                        ctx.lineWidth = 2;
                        ctx.textAlign = 'center';
                        ctx.font = '16px Arial';
                        ctx.fillStyle = '#000000';
                        // 一番上は0ではなく12で描画
                        if (angle === 0) {
                            ctx.fillText(12, 0, -this.r + 25);
                        } else {
                            ctx.fillText(angle/30, 0, -this.r + 25);
                        }
                    // その他は細く短く
                    } else {
                        ctx.lineTo(0, -this.r + 5);
                    }
                });
            }
        }
        drawHands() {
            // 時
            this.drawer.draw(this.h*30 + this.m*0.5, ctx => {
                ctx.lineWidth = 6;
                ctx.moveTo(0, 10);
                ctx.lineTo(0, -this.r + 45);
                ctx.stroke();
            });
            // 分
            this.drawer.draw(this.m*6, ctx => {
                ctx.lineWidth = 3;
                ctx.moveTo(0, 10);
                ctx.lineTo(0, -this.r + 15);
                ctx.stroke();
            });
            // 秒
            this.drawer.draw(this.s*6, ctx => {
                ctx.lineWidth = 0.75;
                ctx.strokeStyle = '#ff0000';
                ctx.moveTo(0, 15);
                ctx.lineTo(0, -this.r + 10);
                ctx.stroke();
            });
        }
        update() {   
            // 時刻情報
            this.year = new Date().getFullYear();
            this.month = new Date().getMonth();
            this.date = new Date().getDate();
            this.day = new Date().getDay();
            this.h = new Date().getHours();
            this.m = new Date().getMinutes();
            this.s = new Date().getSeconds();         
        }
        
        display() {
            const dsp = document.getElementById('display');
            let mo = '';
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
            months.forEach((month, index) => {
                if (index === this.month) {
                    mo = month;
                } else {
                    return;
                }
            });

            let d = '';
            const days = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ];
            days.forEach((day, index) => {
                if (index === this.day) {
                    d = day;
                } else {
                    return;
                }
            });

            const y = this.year;
            const dt = this.date;
            const h = String(this.h).padStart(2, "0");
            const m = String(this.m).padStart(2, "0");
            const s = String(this.s).padStart(2, "0");
            dsp.innerHTML = `${y} ${dt}th/${mo} ${d} ${h}:${m}:${s}`;
        }
        run() {
            this.update();
            // 盤面をいったんクリア
            this.drawer.clear();
            // 盤面描画
            this.drawFace();
            // 針の描画
            this.drawHands();

            // デジタル表示
            this.display();

            setTimeout(() => {
                this.run();
            }, 100);
        }
    }
    // canvas要素の取得
    const canvas = document.querySelector('canvas');
    if (typeof canvas.getContext === 'undefined') {
        return;
    }
    // インスタンス化
    const clock = new Clock(new Clockdrawer(canvas));
    clock.run();

}) ();