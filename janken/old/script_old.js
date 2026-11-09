// function myResult(jankenUser){
//     var jankenComp = Math.floor(Math.random()*3);
//     var jankenName = ["グー", "チョキ", "パー"];

//     var strMsg1 = "あいこです";
//     var strMsg2 = "あなたの勝ちです";
//     var strMsg3 = "あなたの負けです";

//     var strMsg = "相手は" + jankenName[jankenComp] + "、";

//     switch(jankenUser){
//         case 0: //ユーザーがグー
//             if(jankenComp == 0){ //相手がグー
//                 strMsg += strMsg1;
//             }
//             else if(jankenComp == 1){ //相手がチョキ
//                 strMsg += strMsg2;
//             }
//             else if(jankenComp == 2){ //相手がパー
//                 strMsg += strMsg2;
//             }
//         break;
//         case 1: //ユーザーがチョキ
//             if(jankenComp == 0){ //相手がグー
//                 strMsg += strMsg3;
//             }
//             else if(jankenComp == 1){ //相手がチョキ
//                 strMsg += strMsg1;
//             }
//             else if(jankenComp == 2){ //相手がパー
//                 strMsg += strMsg2;
//             }
//         break;
//         case 2: //ユーザーがパー
//             if(jankenComp == 0){ //相手がグー
//                 strMsg += strMsg2;
//             }
//             else if(jankenComp == 1){ //相手がチョキ
//                 strMsg += strMsg3;
//             }
//             else if(jankenComp == 2){ //相手がパー
//                 strMsg += strMsg1;
//             }
//         break;
//     }
//     return(strMsg);
// }

// 文字送りタイマーを管理する変数
var typeTimer = null;

// 1. 画面が読み込まれたら自動的にスタート
document.addEventListener("DOMContentLoaded", function() {
    // 最初にすべてのボタンを無効化しておく
    document.getElementById("btnG").disabled = true;
    document.getElementById("btnC").disabled = true;
    document.getElementById("btnP").disabled = true;

    // ドラクエ風の初期メッセージ（改行付き）
    var startMessage = "おお、勇者よ。じゃんけんの世界へよく来た。\nモンスターにじゃんけんで勝たないと\nこの世界から出られない。\n\nどうする？";

    // 💡 初期メッセージ用の文字送り（第2引数にtrueを渡すと、終わった後にボタンが有効化されます）
    textTyping(startMessage, true);
});

// 2. ボタンが押されたときに呼ばれる関数
function myChoice(jankenUser) {
    var strLocal = myResult(jankenUser);
    
    // 💡 じゃんけん結果用の文字送り（ボタンは有効のままなのでfalse）
    textTyping(strLocal, false);
}

// 📦 【新機能】文字送りを共通で行う関数
function textTyping(text, isFirstTime) {
    // もし前のタイマーが動いていたら一度クリアする
    if (typeTimer !== null) {
        clearInterval(typeTimer);
    }
    
    var msgBox = document.getElementById("msgBox");
    msgBox.innerText = ""; // ボックスを空にする
    
    var index = 0;
    
    // 50ミリ秒ごとに1文字ずつ表示
    typeTimer = setInterval(function() {
        if (index < text.length) {
            msgBox.innerText += text.charAt(index);
            index++;
        } else {
            // すべて表示し終わったらタイマーを停止
            clearInterval(typeTimer);
            typeTimer = null;
            
            // 💡 最初のメッセージが表示し終わった時だけ、ボタンを有効化する
            if (isFirstTime) {
                document.getElementById("btnG").disabled = false;
                document.getElementById("btnC").disabled = false;
                document.getElementById("btnP").disabled = false;
            }
        }
    }, 150);
}

// 3. 勝敗を計算して文字列を返す関数（ここは変更なし）
function myResult(jankenUser) {
    var hands = ["グー", "チョキ", "パー"];
    var jankenCpu = Math.floor(Math.random() * 3);
    var resultText = "";
    
    if (jankenUser === jankenCpu) {
        resultText = "引き分けだ！\n 残念、まだここから出られない。";
    } else if (
        (jankenUser === 0 && jankenCpu === 1) ||
        (jankenUser === 1 && jankenCpu === 2) ||
        (jankenUser === 2 && jankenCpu === 0)
    ) {
        resultText = "勇者の 勝ちだ！\n おめでとう！出口へ案内しよう。";
    } else {
        resultText = "勇者の 負けだ…\n 残念、まだここから出られない。";
    }
    
    var message = "勇者は " + hands[jankenUser] + " をくりだした！\n";
    message += "モンスターは " + hands[jankenCpu] + " をくりだした！\n\n";
    message += resultText;
    
    return message;
}
