// 文字送りタイマーを管理する変数
var typeTimer = null;

// 勝敗の結果（"win", "lose", "draw"）を一時的に保存する変数
var gameResult = "";

// ブラウザの音声機能を準備
var audioCtx = null;

// 1. 画面が読み込まれたら自動的に実行される（初期化だけ）
document.addEventListener("DOMContentLoaded", function() {
    // じゃんけんボタンを最初に無効化しておく
    document.getElementById("btnG").disabled = true;
    document.getElementById("btnC").disabled = true;
    document.getElementById("btnP").disabled = true;
});

// STARTボタンが押されたときにゲームを開始する関数
function startGame() {
    // 💡 ユーザーがクリックしたこの瞬間に音声を初期化（これで1回目から音が鳴る！）
    if (!audioCtx) {
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // タイトル画面を消して、ゲーム画面を表示する
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";

    // 最初のストーリーメッセージを流す
    var startMessage = "おお、勇者よ。じゃんけんの世界へよく来た。\nモンスターにじゃんけんで勝たないと\nこの世界から出られない。\n\nどうする？";
    textTyping(startMessage, false);
}

function myChoice(jankenUser) {
    // ブラウザの音声機能を確実に初期化・再開させるコード
    if (!audioCtx) {
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

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
            var char = text.charAt(index);
            msgBox.innerText += char;
            index++;
            
            // スペースや改行以外の「文字」が表示された時だけピピッと音を鳴らす
            if (char !== " " && char !== "\n") {
                playBleep();
            }
        } else {
            clearInterval(typeTimer);
            typeTimer = null;
            
            // 文字送りが「すべて完了」した直後に勝敗に応じたファンファーレを鳴らす
            if (isResult) {
                if (gameResult === "win") {
                    playWinSound(); // 勝ち音
                    
                    document.getElementById("btnG").style.display = "none";
                    document.getElementById("btnC").style.display = "none";
                    document.getElementById("btnP").style.display = "none";
                    document.getElementById("btnReset").style.display = "inline-block";
                } else if (gameResult === "lose") {
                    playLoseSound(); // 負け音
                    
                    document.getElementById("btnG").disabled = false;
                    document.getElementById("btnC").disabled = false;
                    document.getElementById("btnP").disabled = false;
                } else {
                    document.getElementById("btnG").disabled = false;
                    document.getElementById("btnC").disabled = false;
                    document.getElementById("btnP").disabled = false;
                }
            } else {
                document.getElementById("btnG").disabled = false;
                document.getElementById("btnC").disabled = false;
                document.getElementById("btnP").disabled = false;
            }
        }
    }, 100);
}

// 1文字ごとの「ピピッ」という短い音
function playBleep() {
    if (!audioCtx) return;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = "triangle"; 
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); 
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
}

// 勝ったときのファンファーレ（ド・ミ・ソ♪ の上昇音）
function playWinSound() {
    if (!audioCtx) return;
    
    var notes = [523.25, 659.25, 783.99];
    var duration = 0.12; 

    notes.forEach(function(freq, i) {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        
        osc.type = "square"; 
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i * duration));
        
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime + (i * duration));
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + ((i + 1) * duration));
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(audioCtx.currentTime + (i * duration));
        osc.stop(audioCtx.currentTime + ((i + 1) * duration));
    });
}

// 負けたときのショボーン音（ファ〜、ミ〜〜.. の下降音）
function playLoseSound() {
    if (!audioCtx) return;

    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    
    osc.type = "triangle"; 
    
    var now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(349.23, now); 
    osc.frequency.linearRampToValueAtTime(293.66, now + 0.5); 

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.5);
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