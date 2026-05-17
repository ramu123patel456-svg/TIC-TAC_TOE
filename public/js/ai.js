const board =
    document.getElementById("board");

const statusText =
    document.getElementById("status");

let boxes = [];

let turn = "X";

let gameOver = false;

let player = "X";

let ai = "O";

let scoreX = 0;

let scoreO = 0;

// ================= CREATE BOARD =================

for(let i = 0; i < 9; i++){

    const cell =
        document.createElement("div");

    cell.className = "cell";

    cell.dataset.index = i;

    cell.addEventListener("click", play);

    board.appendChild(cell);

    boxes.push(cell);
}

// ================= PLAY =================

function play(){

    if(gameOver) return;

    if(turn !== player) return;

    if(this.innerText !== "") return;

    this.innerText = player;

    if(checkWinner(player)){

        endGame(player + " Wins");

        scoreX++;

        document.getElementById("scoreX").innerText =
            scoreX;

        return;
    }

    if(isDraw()){

        endGame("Draw Match");

        return;
    }

    turn = ai;

    statusText.innerText =
        "AI Thinking...";

    setTimeout(aiMove,500);
}

// ================= AI MOVE =================

function aiMove(){

    if(gameOver) return;

    let move =
        findBestMove(ai);

    if(move === null){

        move =
            findBestMove(player);
    }

    if(move === null){

        let empty = [];

        boxes.forEach((box,index)=>{

            if(box.innerText === ""){

                empty.push(index);
            }
        });

        move =
            empty[Math.floor(Math.random()*empty.length)];
    }

    boxes[move].innerText = ai;

    if(checkWinner(ai)){

        endGame(ai + " Wins");

        scoreO++;

        document.getElementById("scoreO").innerText =
            scoreO;

        return;
    }

    if(isDraw()){

        endGame("Draw Match");

        return;
    }

    turn = player;

    statusText.innerText =
        "Your Turn";
}

// ================= BEST MOVE =================

function findBestMove(symbol){

    const patterns = [

        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]
    ];

    for(let pattern of patterns){

        const [a,b,c] = pattern;

        const values = [

            boxes[a].innerText,
            boxes[b].innerText,
            boxes[c].innerText
        ];

        if(values.filter(v=>v===symbol).length === 2 &&
           values.includes("")){

            if(values[0] === "") return a;

            if(values[1] === "") return b;

            if(values[2] === "") return c;
        }
    }

    return null;
}

// ================= CHECK WIN =================

function checkWinner(symbol){

    const patterns = [

        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]
    ];

    return patterns.some(pattern=>{

        return pattern.every(index=>{

            return boxes[index].innerText === symbol;
        });
    });
}

// ================= DRAW =================

function isDraw(){

    return boxes.every(box=>{

        return box.innerText !== "";
    });
}

// ================= END GAME =================

function endGame(text){

    gameOver = true;

    statusText.innerText = text;

    showPopup(text);
}

// ================= POPUP =================

function showPopup(text){

    const old =
        document.querySelector(".popup");

    if(old) old.remove();

    const popup =
        document.createElement("div");

    popup.className = "popup";

    const box =
        document.createElement("div");

    box.className = "popup-box";

    const title =
        document.createElement("h1");

    title.innerText = text;

    const restartBtn =
        document.createElement("button");

    restartBtn.innerText =
        "Play Again";

    const homeBtn =
        document.createElement("button");

    homeBtn.innerText =
        "Home";

    restartBtn.onclick = ()=>{

        resetGame();

        popup.remove();
    };

    homeBtn.onclick = ()=>{

        window.location.href =
            "index.html";
    };

    box.appendChild(title);

    box.appendChild(restartBtn);

    box.appendChild(homeBtn);

    popup.appendChild(box);

    document.body.appendChild(popup);
}

// ================= RESET =================

function resetGame(){

    boxes.forEach(box=>{

        box.innerText = "";
    });

    gameOver = false;

    turn = player;

    statusText.innerText =
        "Your Turn";
}