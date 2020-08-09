const settings = require('../settings.json');
const identification = require('../utils/identification');

module.exports = (socket, users, io) => {
    console.log(`User connected`);
    let id = identification.generateUserID();

    // IDENTIFICATION
    socket.emit('id'); //request identification

    socket.on('id', msg => {
        if (users[msg]) {
            socket.emit('id ok');
        } else {
            socket.emit('id not ok');
        }
    });

    socket.on('no id', msg => {
        socket.emit('new id', identification.generateUserID());
    });

    users[id] = {
        score: 0,
        roundsPlayed: 0
    };
    console.log(users);

    socket.on('alert', msg => console.log(msg));

    socket.on('disconnect', msg => {
        console.log(`User ${id} disconnected`);
        delete users[id];
    });

    socket.on('round finish', msg => {
        const { score } = msg;
        if (settings.verbose) console.log(`Team at socket ${id} has finished a round with score: ${score}`);
    });

    socket.on('chat message', msg => console.log(msg))
}