const identification = require('../utils/identification');
const { verbose } = require('sqlite3');
const Game = require('../data/Game');
const settingsFile = require('../settings.json');

module.exports = {
    words: async (req, res, db) => {
        console.dir(req.body);

        // Parsing options
        options = {
            amount: 5,
            list: undefined
        }
    
        if (req.query.amount) {
            options.amount = parseInt(req.query.amount)
        }
    
        if (req.query.list) {
            options.list = req.query.list
        } else {
            return res.status(400).send('List param missing');
        }
    
        let x = await db.getAllListsWithWords('niels')
        console.log(x);
        return res.send(await (await db).getWords(options));
    },

    connect: async (req, res, users) => {
        let id = identification.generateUserID();
        let spec = users.length > 2;
        let json = { id: id, spectator: spec }
        res.json(json);
        users.push(json);
        verbose(users)
    },

    init: async (req, res, users, gamecode) => {
        if (!settingsFile.gamehub.active) gamecode = 'mfsb'
        process.game = new Game(gamecode);
        res.json({ gamecode: gamecode });
        verbose('Started a new game with gamecode: ' + gamecode);
    },

    identify: async (req, res, users) => {
        let json = undefined;
        if (!req.body.id) {
            res.status(400).send('id missing');
        } else if (!users.contains(req.body.id)) {
            if (users.length > 2) {
                json = {
                    id: res.body.id,
                    spectator: true
                }
            } else {
                json = {
                    id: res.body.id,
                    spectator: false
                }
            }
            res.status(200).json(json);
            users.put(json);
        }
        res.status(200).send('ok');
    },
    
    /**
     * Gets the current game state, yay for polling
     */
    state: async (req, res) => {
        res.status(200).json(process.game.toJson());
    },

    /**
     * POST for changing settings
     */
    settings: async (req, res) => {
        game = process.game;
        try {
            if (req.body === {}) {
                return req.status(400).json()
            } else if (req.body.time) {
                if (!game.setTimePerRound(parseInt(req.body.time))) return res.status(400).json({ bad_request: 'min/max exceeded' })
            } else if (req.body.rounds) {
                if (!game.setAmountOfRoundsPerTeam(parseInt(req.body.rounds))) return res.status(400).json({ bad_request: 'min/max exceeded' })
            } else if (req.body.words) {
                if (!game.setAmountOfWords(parseInt(req.body.words))) return res.status(400).json({ bad_request: 'min/max exceeded' })
            } else if (req.body.phones !== undefined) {
                console.log(req.body)
                game.setDualPhones(req.body.phones);
            } else if (req.body.spectators !== undefined) {
                game.setAllowSpectators(req.body.spectators);
            }
        } catch (err) {
            return res.status(500).json({ bad_request: err })
        }
        res.status(200).json(process.game.toJson());
    }
}