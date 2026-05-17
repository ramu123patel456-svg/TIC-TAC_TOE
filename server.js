const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let waitingPlayer = null;

// ================= CONNECTION =================

wss.on("connection", (ws) => {

    console.log("Player Connected");

    // ================= WAITING PLAYER =================

    if (waitingPlayer === null) {

        waitingPlayer = ws;

        ws.send(JSON.stringify({
            type: "waiting"
        }));

        return;
    }

    // ================= MATCH CREATED =================

    const playerX = waitingPlayer;
    const playerO = ws;

    waitingPlayer = null;

    let board = Array(9).fill("");
    let currentPlayer = "X";
    let gameOver = false;

    // ================= START GAME =================

    playerX.send(JSON.stringify({
        type: "start",
        symbol: "X",
        turn: true
    }));

    playerO.send(JSON.stringify({
        type: "start",
        symbol: "O",
        turn: false
    }));

    // ================= RESTART FUNCTION =================

    function restartGame() {

        board = Array(9).fill("");
        currentPlayer = "X";
        gameOver = false;

        playerX.send(JSON.stringify({
            type: "restart",
            board,
            current: "X",
            turn: true,
            symbol: "X"
        }));

        playerO.send(JSON.stringify({
            type: "restart",
            board,
            current: "X",
            turn: false,
            symbol: "O"
        }));
    }

    // ================= CHECK WIN =================

    function checkWinner() {

        const wins = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];

        for (let combo of wins) {

            const [a, b, c] = combo;

            if (
                board[a] &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {

                gameOver = true;

                const winData = JSON.stringify({
                    type: "win",
                    winner: board[a]
                });

                playerX.send(winData);
                playerO.send(winData);

                return;
            }
        }

        // ================= DRAW =================

        if (board.every(cell => cell !== "")) {

            gameOver = true;

            const drawData = JSON.stringify({
                type: "draw"
            });

            playerX.send(drawData);
            playerO.send(drawData);
        }
    }

    // ================= HANDLE MESSAGE =================

    function handleMessage(player, data) {

        // ================= MOVE =================

        if (data.type === "move") {

            if (gameOver) return;

            const symbol = player === playerX ? "X" : "O";

            if (symbol !== currentPlayer) return;

            if (board[data.index] !== "") return;

            board[data.index] = symbol;

            currentPlayer = currentPlayer === "X" ? "O" : "X";

            const moveData = JSON.stringify({
                type: "move",
                board,
                current: currentPlayer
            });

            playerX.send(moveData);
            playerO.send(moveData);

            checkWinner();
        }

        // ================= PLAY AGAIN REQUEST =================

        if (data.type === "playAgainRequest") {

            const opponent = player === playerX ? playerO : playerX;

            if (opponent && opponent.readyState === WebSocket.OPEN) {

                opponent.send(JSON.stringify({
                    type: "playAgainRequest"
                }));
            }
        }

        // ================= RESTART =================

        if (data.type === "restart") {

            restartGame();
        }
    }

    // ================= MESSAGE LISTENERS =================

    playerX.on("message", (msg) => {
        handleMessage(playerX, JSON.parse(msg));
    });

    playerO.on("message", (msg) => {
        handleMessage(playerO, JSON.parse(msg));
    });

    // ================= DISCONNECT =================

    function disconnect() {

        try {

            const msg = JSON.stringify({
                type: "disconnect"
            });

            if (playerX.readyState === WebSocket.OPEN) {
                playerX.send(msg);
            }

            if (playerO.readyState === WebSocket.OPEN) {
                playerO.send(msg);
            }

        } catch (err) {
            console.log(err);
        }
    }

    playerX.on("close", disconnect);
    playerO.on("close", disconnect);
});

// ================= START SERVER =================

server.listen(3000, () => {
    console.log("Server Running : http://localhost:3000");
});