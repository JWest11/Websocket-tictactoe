let TicTacToe = require('./game');

const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://127.0.0.1:5500'],
        rejectUnauthorized: false
    }
});


const games = new Map();

io.on('connection', (socket) => {
    console.log(socket.id, 'new connection!');

    socket.on('join-room', (roomName) => {

        const userId = socket.id;
        const rooms = io.of("/").adapter.rooms;
        const sids = io.of("/").adapter.sids;
        let currentRoom = false;

        if (sids.get(userId).size > 1) {
            sids.get(userId).forEach(element => {
                if (element !== userId) {
                    currentRoom = element;
                };
            });
            socket.leave(currentRoom);
        };

        if (rooms.has(roomName)) {
            if (rooms.get(roomName).size >= 2) {
                socket.emit("message-to-client", "Room Full");
            } else {
                socket.join(roomName);
                io.to(roomName).emit("room-join-message", `${userId} joined room ${roomName}`, roomName);
            };
        } else {
            socket.join(roomName);
            io.to(roomName).emit("room-join-message", `${userId} joined room ${roomName}`, roomName);
        };

        if (rooms.get(roomName).size == 2) {
            initializeGame(roomName);
        };
        

        console.log(io.of("/").adapter.sids);
        console.log(io.of("/").adapter.rooms);

    });

    socket.on("move-made", (newBoard, room, xTurn) => {
        let game = games.get(room);
        game.processMove(xTurn, newBoard);
    });
});

function initializeGame(room) {
    let counter = 0;
    let p1 = null;
    let p2 = null;
    const currRoom = io.of("/").adapter.rooms.get(room);
    currRoom.forEach(element => {
        if (counter == 0) {
            p1 = element;
        } else {
            p2 = element;
        };
        counter += 1;
    });
    games.set(room, new TicTacToe(room, p1, p2, io));
    console.log(`game initialized for room ${room}`);
    io.to(room).emit("game-start-message", p1);
    io.to(room).emit("nextTurn", true, ['','','','','','','','',''])

};