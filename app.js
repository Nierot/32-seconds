const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const body_parser = require('body-parser');
const db = require('./utils/database');
const io = require('socket.io')(http, { path: 'socket.io' });
const settings = require('./settings.json');


app.get('/', require('./routes/base'));

app.get(`/words`, body_parser.json(), (req, res) => require('./routes/rest/words')(req, res, db));

io.on('connection', socket => {
    console.log('a user connected');

});

app.use(cors);

app.use(body_parser);

http.listen(settings.port, () => {
    console.log(`listening on http://localhost:${settings.port}`);

});