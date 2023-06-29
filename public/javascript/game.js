let winFlg = false;
let cnt = 0;
let gameBoxes = document.querySelectorAll('.box');
let playerEl = document.getElementById('player');
let h1El= document.getElementsByTagName('h1')[0];

//player設定
import Player from './player.js';
const player1 = new Player("1","Player1","blue","〇",false);
const player2 = new Player("2","Player2","pink","×",true);

//playerの初期設定
let nowPlayer = player1;
let nextPlayer = player2;



let playerClick = ()=>{
    for(let i=0;i<gameBoxes.length;i++){
        gameBoxes[i].addEventListener("click",function(){
            let checkClicked = player1.checkClicked(gameBoxes[i]) || player2.checkClicked(gameBoxes[i]);
            //空白クリック時
            if(checkClicked == false && winFlg == false){
                cnt++;
                console.log(`${cnt}:${winFlg}`);
                clickedBox(this);
            }
        });
    }
};


//boxがクリックされたときの処理
let clickedBox = (box) =>{
    //playerの処理
    box.classList.add(nowPlayer.color);
    box.classList.remove("blank");
    box.innerText = nowPlayer.text;
    //勝利判定
    if(checkWin(nowPlayer.color)){
        winFlg = true;
        h1El.innerText = `${nowPlayer.name}の勝利`;
    }else if(cnt == 9){
        h1El.innerText = "引き分けです";
    }else{
        //次のplayerの準備
        playerEl.innerHTML = `${nextPlayer.name}の番です`;
        toglePlayer();
        if(nowPlayer.isCom)comClick();
    }
};

// player切り替え
let toglePlayer = ()=>{
    let tmpPlayer = nowPlayer;
    nowPlayer = nextPlayer;
    nextPlayer = tmpPlayer;
};

// computerクリック
let comClick = ()=>{
    let blankBoxes = document.getElementsByClassName("blank");
    let randomBox = blankBoxes[Math.floor(Math.random()*blankBoxes.length)];
    clickedBox(randomBox);
}

//勝利チェック
const winPatern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let checkWin = (className) =>{
    let checkPatern = false;
    for(let i=0;i<winPatern.length;i++){
        checkPatern = gameBoxes[winPatern[i][0]].classList.contains(className) && gameBoxes[winPatern[i][1]].classList.contains(className) && gameBoxes[winPatern[i][2]].classList.contains(className);
        if(checkPatern) return checkPatern;
    }
    return checkPatern;
};

//main

console.log("aaa");
playerClick();