const settings = require('../settings.json');
const identification = require('../utils/identification');
const { info, verbose, error } = require('nielog').Log;
const User = require('../data/User');

module.exports = (socket, users, io, log) => {
    const { info, verbose, error } = log;
    verbose(`User connected`);
    let id = identification.generateUserID();

    // IDENTIFICATION
    socket.emit('id'); //request identification

    socket.on('id', msg => {
        if (users[msg]) {
            socket.emit('id ok');
        } else {
            socket.emit('new id', id);
            users[id] = new User(id);
        }
    });

    socket.on('no id', msg => {
        socket.emit('new id', id);
        users[id] = new User(id);
    });

    verbose(users);

    socket.on('disconnect', msg => {
        verbose(`User ${id} disconnected`);
        delete users[id];
    });

    socket.on('round finish', msg => {
        const { score } = msg;
        if (settings.verbose) verbose(`Team at socket ${id} has finished a round with score: ${score}`);
    });

    socket.on('chat message', msg => console.log(msg))
}