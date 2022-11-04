class CurrentGame {
    constructor(isX, room) {
        this.isX = isX;
        this.room = room;
        this.value = null;
        if (isX) {
            this.value = "X"
        } else {
            this.value = "O"
        };
    }
    board = ['','','','','','','','',''];
    curriedEventListenerFunctions = {};

    renderBoard() {
        document.querySelectorAll(".gridItem").forEach((element) => {
            element.innerText = "";
        });
        for (let i=0; i<this.board.length; i++) {
            document.getElementById(`${i}`).innerText = this.board[i];
        };
    };

    newTurn(xTurn, newBoard) {
        this.setBoard(newBoard);
        if (xTurn == this.isX) {
            this.yourTurn();
        } else {
            this.otherPlayerTurn();
        }
    };

    otherPlayerTurn() {
        return;
    };

    initiateMove(tileId) {
        this.makeMove(tileId);
    };

    makeMove(index) {
        this.clearListeners();
        this.board[index] = this.value;
        socket.emit("move-made", this.board, this.room, this.isX);
        this.renderBoard();
    };

    yourTurn() {
        const gridItems = document.querySelectorAll('.gridItem');
        gridItems.forEach((cell) => {
            if (this.board[cell.id] === "") {
                cell.addEventListener("click", selectTile)
                cell.classList.add("clickable");
            };
        });
    };

    clearListeners() {
        const gridItems = document.querySelectorAll('.gridItem');
        gridItems.forEach((cell) => {
            cell.removeEventListener("click", selectTile)
            cell.classList.remove("clickable");
        });
    };
    setBoard(newBoard) {
        this.board = newBoard;
        this.renderBoard();
    };
};