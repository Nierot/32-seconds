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
    });

    socket.on('disconnect', msg => {
        verbose(`User disconnected`);
        delete process.users[id];
    });

    // SETTINGS

    const updateSettings = id => socket.emit('setting changes', process.games[id]);

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

    socket.on('setting list', msg => {
        process.games[msg.id].addList(msg.setting);
        updateSettings(msg.id);
    })

    socket.on('setting team 1', msg => {
        process.games[msg.id].addPlayer(msg.setting, 1);
        updateSettings(msg.id);
    })

    socket.on('setting team 2', msg => {
        process.games[msg.id].addPlayer(msg.setting, 2);
        updateSettings(msg.id);
    })

    socket.on('setting team clear', msg => {
        process.games[msg.id].clearPlayers();
        updateSettings(msg.id);
    })

    // LOBBY

    socket.on('new lobby', msg => {
        info(`Starting a new lobby for ${msg}`);
        process.games[msg] = new Game(identification.generateGameCode(), msg);
        socket.emit('lobby', process.games[msg])
    })

    // GAME

    socket.on('start game', id => {
        process.games[id].state.started = true;
        process.games[id].state.turn.player = process.games[id].settings.teams.teamOne[0];
        socket.emit('start game', process.games[id]);
        updateGame(id);
    })

    socket.on('end turn', msg => {
        let game = process.games[msg.id];
        game.switchTurn();
        game.startedRound = false;
        socket.emit('end turn', game);
        updateGame(msg.id);
    })

    const updateGame = id => socket.emit('game update', process.games[id]);

    socket.on('round finish', msg => {
        const { score } = msg;
        if (settings.verbose) verbose(`Team at socket ${id} has finished a round with score: ${score}`);
    });

    socket.on('score', msg => {
        let game = process.games[msg.id];
        game.wordGuessed(msg.word);
        game.state.turn.team === 1 ? game.incrementScore(1, 1) : game.incrementScore(1, 2);
        updateGame(msg.id);
    });

    socket.on('undo score', msg => {
        let game = process.games[msg.id];
        game.wordUnguessed(msg.word);
        game.state.turn.team === 1 ? game.incrementScore(-1, 1) : game.incrementScore(-1, 2);
        updateGame(msg.id);
    });

    socket.on('remove word', msg => {
        console.log(msg);
        process.games[msg.id].wordGuessed(msg.word);
        updateGame(msg.id);
    });

    socket.on('get words', (msg, callback) => callback(process.db.getWords(msg)))

    socket.on('get lists', msg => socket.emit('lists', process.lists));

    socket.on('new list', list => {
        process.lists.push(list);
        process.db.addList(list);
    });

    //TESTS

    socket.on('get game', id => socket.emit('game', process.games[id]));
    socket.on('test', () => socket.emit('test'));
}