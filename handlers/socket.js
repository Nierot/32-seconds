const settings = require('../settings.json');
const identification = require('../utils/identification');
const User = require('../data/User');
const Game = require('../data/Game');

module.exports = (socket, io, log) => {
    const { info, verbose, error } = log;
    verbose(`User connected`);
    let id = identification.generateUserID();

    // IDENTIFICATION
    socket.emit('id'); //request identification

    socket.on('id', msg => {
        console.log(msg);
        console.log(process.users)
        if (process.users[msg]) {
            console.log('oof')
            socket.emit('id ok');
        } else {
            if (msg !== '' && msg !== undefined && msg !== null) {
                socket.emit('id ok');
                process.users[msg] = new User(msg, socket);
            } else {
                socket.emit('new id', id);
                process.users[id] = new User(id, socket);
            }
        }
    });

    socket.on('no id', msg => {
        socket.emit('new id', id);
        process.users[id] = new User(id, socket);
        console.log(process.users);
    });

    socket.on('disconnect', msg => {
        verbose(`User disconnected`);
        delete process.users[id];
    });

    // SETTINGS



    // LOBBY

    socket.on('new lobby', msg => {
        process.games[msg] = new Game(identification.generateGameCode(), msg);
    })

    // GAME

    socket.on('round finish', msg => {
        const { score } = msg;
        if (settings.verbose) verbose(`Team at socket ${id} has finished a round with score: ${score}`);
    });

    
    //TESTS

    socket.on('test', () => socket.emit('test'));
}