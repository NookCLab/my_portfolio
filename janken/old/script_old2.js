// 文字送りタイマーを管理する変数
var typeTimer = null;

// 勝敗の結果（"win", "lose", "draw"）を一時的に保存する変数
var gameResult = "";

// 1. 画面が読み込まれたら自動的にスタート
document.addEventListener("DOMContentLoaded", function() {
    // 最初にすべてのボタンを無効化
    document.getElementById("btnG").disabled = true;
    document.getElementById("btnC").disabled = true;
    document.getElementById("btnP").disabled = true;

    var startMessage = "おお、勇者よ。じゃんけんの世界へよく来た。\nモンスターにじゃんけんで勝たないと\nこの世界から出られない。\n\nどうする？";
    
    // 第2引数（isResult）は「false」
    textTyping(startMessage, false);
});

// 2. じゃんけんボタンが押されたときに呼ばれる関数
function myChoice(jankenUser) {
    var strLocal = myResult(jankenUser);
    
    // 第2引数（isResult）に「true」を渡して、じゃんけん結果であることを伝える
    textTyping(strLocal, true);
}

// 文字送りを共通で行う関数
function textTyping(text, isResult) {
    // 文字送りが始まったらボタンを無効化
    document.getElementById("btnG").disabled = true;
    document.getElementById("btnC").disabled = true;
    document.getElementById("btnP").disabled = true;

    // タイマーの初期化
    if (typeTimer !== null) {
        clearInterval(typeTimer);
    }
    
    var msgBox = document.getElementById("msgBox");
    msgBox.innerText = "";
    
    var index = 0;
    
    typeTimer = setInterval(function() {
        if (index < text.length) {
            msgBox.innerText += text.charAt(index);
            index++;
        } else {
            clearInterval(typeTimer);
            typeTimer = null;
            
            // 文字送りが「すべて完了」した後の動き
            if (isResult) {
                // じゃんけん結果を出し終えた場合：
                
                if (gameResult === "win") {
                    // 【勝った時だけ】じゃんけんボタンを隠し、もう一度ボタンを出す
                    document.getElementById("btnG").style.display = "none";
                    document.getElementById("btnC").style.display = "none";
                    document.getElementById("btnP").style.display = "none";
                    document.getElementById("btnReset").style.display = "inline-block";
                } else {
                    // 【引き分け・負けの時】ボタンは隠さず、そのまま有効化して次のじゃんけんへ
                    document.getElementById("btnG").disabled = false;
                    document.getElementById("btnC").disabled = false;
                    document.getElementById("btnP").disabled = false;
                }
                
            } else {
                // 最初やリセット時のメッセージを出し終えた場合：ボタンを有効化する
                document.getElementById("btnG").disabled = false;
                document.getElementById("btnC").disabled = false;
                document.getElementById("btnP").disabled = false;
            }
        }
    }, 100);
}

// もう一度ボタンが押されたときに「初めからスタート」する関数
function resetGame() {
    // もう一度ボタンを隠し、じゃんけんボタンを再び表示させる
    document.getElementById("btnReset").style.display = "none";
    document.getElementById("btnG").style.display = "inline-block";
    document.getElementById("btnC").style.display = "inline-block";
    document.getElementById("btnP").style.display = "inline-block";

    // 最初と同じメッセージを流して再スタート
    var restartMessage = "おお、勇者よ。\n再びじゃんけんに挑戦するのだな。\n\nどうする？";
    textTyping(restartMessage, false);
}

// 3. 勝敗を計算して文字列を返す関数
function myResult(jankenUser) {
    var hands = ["グー", "チョキ", "パー"];
    var jankenCpu = Math.floor(Math.random() * 3);
    var resultText = "";
    
    if (jankenUser === jankenCpu) {
        resultText = "引き分けだ…\n 残念、まだここから出られない！";
        gameResult = "draw";  // 引き分けを記憶
    } else if (
        (jankenUser === 0 && jankenCpu === 1) ||
        (jankenUser === 1 && jankenCpu === 2) ||
        (jankenUser === 2 && jankenCpu === 0)
    ) {
        resultText = "勇者の 勝ちだ！";
        gameResult = "win";   // 勝ちを記憶
    } else {
        resultText = "勇者の 負けだ…\n 残念、まだここから出られない！";
        gameResult = "lose";  // 負けを記憶
    }
    
    var message = "勇者は " + hands[jankenUser] + " をくりだした！\n";
    message += "モンスターは " + hands[jankenCpu] + " をくりだした！\n\n";
    message += resultText;
    
    return message;
}