const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');

const PORT = 8080;
const BASE_URL = '/32-seconds/'
const URI = `http://localhost:8080${BASE_URL}`

const io = require('socket.io')(http, {
    path: BASE_URL + 'socket.io'
});

const db = require('./database');

app.get(BASE_URL, (req, res) => {
    res.send("<h1>32-seconds API</h1>")
})


app.get(`${BASE_URL}words`, async (req, res) => {
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

    res.send(await (await db).getWords(options));
});

io.of(BASE_URL).on('connection', socket => {
    console.log('a user connected');

});

app.use(cors({
    origin: URI
}));

http.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}${BASE_URL}`);

});