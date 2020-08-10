const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const body_parser = require('body-parser');
const db = require('./utils/database');
const io = require('socket.io')(http);
const settings = require('./settings.json');
const webRoutes = require('./routes/web');
const restfulRoutes = require('./routes/rest');
const { parentPort } = require('worker_threads');
const socketHandler = require('./handlers/socket');
const { Log } = require('nielog');

let users = {};

app.get('/words', body_parser.json(), (req, res) => restfulRoutes.words(req, res, db));
app.get('/*', webRoutes.game);

io.on('connection', socket => socketHandler(socket, users, io, Log));

app.use(cors);
app.set('view engine', 'ejs');
app.use(body_parser);

const listener = http.listen(settings.development ? 8079 : 0, () => {
    if (settings.gamehub.active) parentPort.postMessage(listener.address().port);

    settings.development ? Log.setLevel(1) : Log.setLevel(2);

    console.log(`Listening on http://localhost:${listener.address().port} `);
});