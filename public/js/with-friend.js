const board =
    document.getElementById("board");

const statusText =
    document.getElementById("status");

let boxes = [];

let turn = "X";

let gameOver = false;

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

    if(this.innerText !== "") return;

    this.innerText = turn;

    // CHECK WIN

    if(checkWinner(turn)){

        gameOver = true;

        statusText.innerText =
            turn + " Wins";

        if(turn === "X"){

            scoreX++;

            document.getElementById("scoreX").innerText =
                scoreX;

        }else{

            scoreO++;

            document.getElementById("scoreO").innerText =
                scoreO;
        }

        showPopup(turn + " Wins");

        return;
    }

    // DRAW

    if(isDraw()){

        gameOver = true;

        statusText.innerText =
            "Draw Match";

        showPopup("Draw Match");

        return;
    }

    // CHANGE TURN

    turn =
        turn === "X"
        ? "O"
        : "X";

    statusText.innerText =
        "Player " + turn + " Turn";
}

// ================= WIN CHECK =================

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

// ================= DRAW CHECK =================

function isDraw(){

    return boxes.every(box=>{

        return box.innerText !== "";
    });
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

    // PLAY AGAIN

    const againBtn =
        document.createElement("button");

    againBtn.innerText =
        "Play Again";

    againBtn.onclick = ()=>{

        resetGame();

        popup.remove();
    };

    // HOME BUTTON

    const homeBtn =
        document.createElement("button");

    homeBtn.innerText =
        "Home";

    homeBtn.onclick = ()=>{

        window.location.href =
            "index.html";
    };

    // APPEND

    box.appendChild(title);

    box.appendChild(againBtn);

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

    turn = "X";

    statusText.innerText =
        "Player X Turn";
}