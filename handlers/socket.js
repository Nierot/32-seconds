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
            socket.emit('id ok', process.games[msg]);
        } else {
            if (msg !== '' && msg !== undefined && msg !== null) {
                socket.emit('id ok', process.games[msg]);
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

    updateSettings = id => socket.emit('setting changes', process.games[id]);

    socket.on('setting rounds', msg => {
        process.games[msg.id].setAmountOfRoundsPerTeam(msg.setting);
        updateSettings(msg.id);
    })

    socket.on('setting words', msg => {
        process.games[msg.id].setAmountOfWords(msg.setting);
        updateSettings(msg.id);
    })

    socket.on('setting time', msg => {
        process.games[msg.id].setTimePerRound(msg.setting);
        updateSettings(msg.id);
    })

    socket.on('setting players', msg => {
        process.games[msg.id].setAmountOfPlayersPerTeam(msg.setting);
        updateSettings(msg.id);
    })

    socket.on('setting teamname1', msg => {
        process.games[msg.id].setTeamNameOne(msg.setting);
        updateSettings(msg.id);
    })

    socket.on('setting teamname2', msg => {
        process.games[msg.id].setTeamNameTwo(msg.setting);
        updateSettings(msg.id);
    })

    // LOBBY

    socket.on('new lobby', msg => {
        info(`Starting a new lobby for ${msg}`);
        process.games[msg] = new Game(identification.generateGameCode(), msg);
        socket.emit('lobby', process.games[msg])
    })

    // GAME

    socket.on('round finish', msg => {
        const { score } = msg;
        if (settings.verbose) verbose(`Team at socket ${id} has finished a round with score: ${score}`);
    });

    
    //TESTS

    socket.on('test', () => socket.emit('test'));
}