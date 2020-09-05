const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const body_parser = require('body-parser');
const io = require('socket.io')(http, {});
const settings = require('./settings.json');
const webRoutes = require('./routes/web');
const { parentPort } = require('worker_threads');
const socketHandler = require('./handlers/socket');
const { Log } = require('nielog');

process.users = [];
process.gamecode = undefined;

//TODO add some handling for when there are no words left. Currently just either spams the last word or prints undefined.

app.get('/newlist', webRoutes.newlist);
app.get('/*', webRoutes.game);

io.on('connection', socket => socketHandler(socket, io, Log));

app.use(cors);
app.set('view engine', 'ejs');
app.use(body_parser);
app.set('views', settings.views_dir);

const listener = http.listen(settings.development ? settings.port : 0, () => {

    process.games = {};
    process.lists = [ { name: 'League of Legends', words: [] }, { name: 'Standard', words: [] } ];

    require('./utils/database').then(db => {
        process.db = db;
        db.getAllListsWithWords().then(lists => process.lists = lists);
    }).catch(err => Log.error(err));
    
    if (settings.gamehub.active) {
        parentPort.postMessage(listener.address().port);
        parentPort.on('message', msg => {
            process.gamecode = msg.gamecode;
            Log.info(game);
        })
    }

    settings.development ? Log.setLevel(1) : Log.setLevel(2);

    Log.info(`Listening on http://localhost:${listener.address().port} `);
});