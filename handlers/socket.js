const settings = require('../settings.json');

module.exports = (socket, users) => {
    const { id } = socket;
    console.log(`User ${id} connected`);
    users[id] = {
        score: 0,
        roundsPlayed: 0
    };
    console.log(users);

    socket.on('message', msg => {
        console.log(users);
    });

    socket.on('disconnect', msg => {
        console.log(`User ${id} disconnected`);
        delete users[id];
    });

    socket.on('round finish', msg => {
        const { score } = msg;
        if (settings.verbose) console.log(`Team at socket ${id} has finished a round with score: ${score}`);
    });
}