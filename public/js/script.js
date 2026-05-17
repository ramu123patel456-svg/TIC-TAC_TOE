const cells = document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const ws =
    new WebSocket("ws://localhost:3000");

let mySymbol = "";

let myTurn = false;

let gameOver = false;

// ================= RECEIVE =================

ws.onmessage = (event) => {

    const data = JSON.parse(event.data);

    // ================= WAITING =================

    if(data.type === "waiting"){

        statusText.innerText =
            "Waiting For Opponent...";
    }

    // ================= START =================

    if(data.type === "start"){

        gameOver = false;

        mySymbol = data.symbol;

        myTurn = data.turn;

        clearBoard();

        statusText.innerText =
            myTurn
                ? "Your Turn ( " + mySymbol + " )"
                : "Opponent Turn";
    }

    // ================= MOVE =================

    if(data.type === "move"){

        updateBoard(data.board);

        myTurn =
            data.current === mySymbol;

        statusText.innerText =
            myTurn
                ? "Your Turn"
                : "Opponent Turn";
    }

    // ================= WIN =================

    if(data.type === "win"){

        gameOver = true;

        showPopup(data.winner + " Wins!");
    }

    // ================= DRAW =================

    if(data.type === "draw"){

        gameOver = true;

        showPopup("Draw Match!");
    }

    // ================= PLAY AGAIN REQUEST =================

    if(data.type === "playAgainRequest"){

        showRequestPopup();
    }

    // ================= RESTART =================

    if(data.type === "restart"){

        gameOver = false;

        clearBoard();

        updateBoard(data.board);

        myTurn = data.turn;

        mySymbol = data.symbol;

        statusText.innerText =
            myTurn
                ? "Your Turn"
                : "Opponent Turn";

        const popup =
            document.querySelector(".popup");

        if(popup){

            popup.remove();
        }

        const reqPopup =
            document.querySelector(".request-popup");

        if(reqPopup){

            reqPopup.remove();
        }
    }

    // ================= DISCONNECT =================

    if(data.type === "disconnect"){

        gameOver = true;

        statusText.innerText =
            "Opponent Disconnected";

        showPopup("Opponent Left!");
    }
};

// ================= CLICK =================

cells.forEach((cell,index)=>{

    cell.addEventListener("click",()=>{

        if(gameOver) return;

        if(!myTurn) return;

        if(cell.innerText !== "") return;

        if(ws.readyState !== WebSocket.OPEN)
            return;

        ws.send(JSON.stringify({

            type:"move",

            index:index
        }));
    });
});

// ================= UPDATE BOARD =================

function updateBoard(board){

    board.forEach((value,index)=>{

        cells[index].innerText = value;
    });
}

// ================= CLEAR BOARD =================

function clearBoard(){

    cells.forEach(cell=>{

        cell.innerText = "";
    });
}

// ================= WIN/DRAW POPUP =================

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

    // ================= PLAY AGAIN =================

    const againBtn =
        document.createElement("button");

    againBtn.innerText =
        "Play Again";

    againBtn.className =
        "again-btn";

    againBtn.onclick = () => {

        if(ws.readyState === WebSocket.OPEN){

            ws.send(JSON.stringify({

                type:"playAgainRequest"
            }));
        }
    };

    // ================= NEW PLAYER =================

    const restartBtn =
        document.createElement("button");

    restartBtn.innerText =
        "New Player";

    restartBtn.className =
        "restart-btn";

    restartBtn.onclick = () => {

        location.reload();
    };

    // ================= HOME =================

    const homeBtn =
        document.createElement("button");

    homeBtn.innerText =
        "Home";

    homeBtn.className =
        "home-btn";

    homeBtn.onclick = () => {

        window.location.href =
            "index.html";
    };

    // ================= APPEND =================

    box.appendChild(title);

    box.appendChild(againBtn);

    box.appendChild(restartBtn);

    box.appendChild(homeBtn);

    popup.appendChild(box);

    document.body.appendChild(popup);
}

// ================= REQUEST POPUP =================

function showRequestPopup(){

    const old =
        document.querySelector(".request-popup");

    if(old) old.remove();

    const popup =
        document.createElement("div");

    popup.className =
        "request-popup";

    const box =
        document.createElement("div");

    box.className =
        "popup-box";

    const title =
        document.createElement("h2");

    title.innerText =
        "Opponent Wants To Play Again";

    // ================= YES =================

    const yesBtn =
        document.createElement("button");

    yesBtn.innerText =
        "Yes";

    yesBtn.className =
        "again-btn";

    yesBtn.onclick = ()=>{

        if(ws.readyState === WebSocket.OPEN){

            ws.send(JSON.stringify({

                type:"restart"
            }));
        }

        popup.remove();
    };

    // ================= NO =================

    const noBtn =
        document.createElement("button");

    noBtn.innerText =
        "No";

    noBtn.className =
        "home-btn";

    noBtn.onclick = ()=>{

        popup.remove();
    };

    // ================= APPEND =================

    box.appendChild(title);

    box.appendChild(yesBtn);

    box.appendChild(noBtn);

    popup.appendChild(box);

    document.body.appendChild(popup);
}