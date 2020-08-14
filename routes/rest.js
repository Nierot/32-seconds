const identification = require('../utils/identification');
const { verbose } = require('sqlite3');
const Game = require('../data/Game');

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

    init: async (req, res, users, gamecode, game) => {
        game = new Game(gamecode);
        res.json({ gamecode: gc });
        verbose('Started a new game with gamecode: ' + gc);
    },

    identify: async (req, res, users) => {
        console.log(req.body);
        res.status(200).send('ok');
    },
}