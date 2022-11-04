const socket = io('http://localhost:3000');

let currentRoom = null;
let currentGame = null;

socket.on('connect', () => {
    flashMessage(`Connected with id ${socket.id}`);
});

socket.on("message-to-client", (msg) => {
    console.log(msg);
    console.log("triggered");
});
socket.on("room-join-message", (msg, room) => {
    console.log(msg);
    setRoomDOM(room);
    console.log("triggered");
});
socket.on("game-start-message", (xTurnId) => {
    console.log("game started!");
    let playerisXTurn = true;
    if (socket.id != xTurnId) {
        playerisXTurn = false;
    };
    currentGame = new CurrentGame(playerisXTurn, currentRoom);
    currentGame.newTurn(true, currentGame.board)
});
socket.on("next-turn", (xTurn, newBoard) => {
    currentGame.newTurn(xTurn, newBoard);
});
socket.on("win-message", (winnerIsX, board) => {
    currentGame.board = board;
    currentGame.renderBoard();
    if (winnerIsX) {
        flashMessage("X wins!!!!")
    } else {
        flashMessage("O wins!!!")
    };
    createNewGameOption();
});
socket.on("draw-message", ( board) => {
    currentGame.board = board;
    currentGame.renderBoard();
    flashMessage("Draw!!!")
    createNewGameOption();
});

function createNewGameOption() {
    document.getElementById("newGameButtonContainer").innerHTML = "<button onclick='newGameRequest()'>New Game</button>";
}

function newGameRequest() {
    return;
};

function selectTile(event) {
    currentGame.initiateMove(event.target.id);
};

function transmitMove(board, room, isX) {
    socket.to(room).emit("move-made", board, room, isX);
};

function clientChangeRoom() {
    let element = document.getElementById("newRoom");
    let roomName = element.value;
    element.value = "";
    socket.emit("join-room", roomName);
    currentRoom = roomName;
};

function flashMessage(msg) {
    document.getElementById("flashMessage").innerText = msg;
};

function setRoomDOM(roomName) {
    document.getElementById("currentRoom").innerText = roomName;
};