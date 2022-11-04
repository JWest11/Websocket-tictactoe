module.exports = class TicTacToeGame {

    constructor(roomName, p1Id, p2Id, io) {
        this.roomName = roomName;
        this.playerX = p1Id;
        this.playerO = p2Id;
        this.io = io;
    };

    turnCount = 0;
    board = ['','','','','','','','',''];

    nextTurn(xTurn) {
        this.io.to(this.roomName).emit("next-turn", xTurn, this.board)
        console.log('nexttttt')
    };

    winCheck() {
        // horizontals
        if (this.board[0] && this.board[0] == this.board[1] && this.board[1] == this.board[2]) {return true}
        else if (this.board[3] && this.board[3] == this.board[4] && this.board[4] == this.board[5]) {return true}
        else if (this.board[6] && this.board[6] == this.board[7] && this.board[7] == this.board[8]) {return true}
        //verticals
        else if (this.board[0] && this.board[0] == this.board[3] && this.board[3] == this.board[6]) {return true}
        else if (this.board[1] && this.board[1] == this.board[4] && this.board[4] == this.board[7]) {return true}
        else if (this.board[2] && this.board[2] == this.board[5] && this.board[5] == this.board[8]) {return true}
        //diagonals
        else if (this.board[0] && this.board[0] == this.board[4] && this.board[4] == this.board[8]) {return true}
        else if (this.board[6] && this.board[6] == this.board[4] && this.board[4] == this.board[2]) {return true}
        return false;
    };

    processMove(xTurn, newBoard) {
        this.turnCount += 1;
        this.board = newBoard;
        if (this.winCheck()) {
            this.io.to(this.roomName).emit("win-message", xTurn, this.board);
        } else if (this.turnCount == 9) {
            this.io.to(this.roomName).emit("draw-message", this.board);
        } else {
            this.nextTurn(!xTurn);
        };
    };



};


