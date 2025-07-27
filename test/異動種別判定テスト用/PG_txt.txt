const st140 = {d:'dummy',sw:'X',st:'X',tr:'O',djk:'X',kr:'X',mr:'X'};
const st150 = {d:'dummy',sw:'X',st:'X',tr:'X',djk:'O',kr:'X',mr:'X'};
const tran_list  = ['sw','st','tr','kr','djk']; //splitでバラす
const st140List = Object.keys(st140);
const st150List = Object.keys(st150);
const cs = '140';

function ExecuteDeal() {
    debugger;
    let setFlg = false;
    if (cs < 140 && !setFlg) {
        for (let j=0; j<st140List.length; j++) {
            for (let i=0; i<tran_list.length; i++) {
                if (tran_list[i] == st140List[j]) {
                    let tranNo = map[tran_list[i]];
                    let FlowJg = st140[tran_list[i]];
            
                    if (FlowJg == 'O' && !setFlg) {
                        console.log('異動種別No：' + tranNo);
                        console.log('フロー判定：' + FlowJg);
                        setFlg = true;
                    }
                }
            }
        }
    }
    if (cs < 150 && !setFlg) {
        for (let j=0; j<st150List.length; j++) {
            for (let i=0; i<tran_list.length; i++) {
                if (tran_list[i] == st150List[j]) {
                    let tranNo = map[tran_list[i]];
                    let FlowJg = st150[tran_list[i]];
            
                    if (FlowJg == 'O' && !setFlg) {
                        console.log('異動種別No：' + tranNo);
                        console.log('フロー判定：' + FlowJg);
                        setFlg = true;
                    }
                }
            }
        }
    }
}


const map = {
    sw:1, ht:2, st:10, tr:15, mh:16, kr:17, djk:18
}



const btn = document.getElementById("trbtn");


btn.addEventListener("click", function (e) {
  ExecuteDeal();
});


