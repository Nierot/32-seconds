const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const body_parser = require('body-parser');
const db = require('./utils/database');
const io = require('socket.io')(http, {});
const settings = require('./settings.json');
const webRoutes = require('./routes/web');
const restfulRoutes = require('./routes/rest');
const { parentPort } = require('worker_threads');
const socketHandler = require('./handlers/socket');
const { Log } = require('nielog');
const Game = require('./data/Game');

process.users = [];
process.gamecode = undefined;

// app.get('/*/words', body_parser.json(), (req, res) => restfulRoutes.words(req, res, db));
// app.get('/*/connect', (req, res) => restfulRoutes.connect(req, res, process.users));
// app.get('/*/init', (req, res) => restfulRoutes.init(req, res));
// app.post('/*/identify', body_parser.json(), (req, res) => restfulRoutes.identify(req, res, process.users));
// app.get('/*/state', (req, res) => restfulRoutes.state(req, res));
// app.post('/*/settings', body_parser.json(), (req, res) => restfulRoutes.settings(req, res));
app.get('/*', webRoutes.game);

io.on('connection', socket => socketHandler(socket, io, Log));

app.use(cors);
app.set('view engine', 'ejs');
app.use(body_parser);
app.set('views', settings.views_dir);

const listener = http.listen(settings.development ? 8079 : 0, () => {

    process.games = {};
    
    if (settings.gamehub.active) {
        parentPort.postMessage(listener.address().port);
        parentPort.on('message', msg => {
            process.gamecode = msg.gamecode;
            Log.info(game);
        })
    }

    settings.development ? Log.setLevel(1) : Log.setLevel(2);

    console.log(`Listening on http://localhost:${listener.address().port} `);
});