const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');

const PORT = 8080;
const BASE_URL = '/32-seconds/'
const URI = `http://localhost:8080${BASE_URL}`

const io = require('socket.io')(http, {
    path: BASE_URL + 'socket.io'
});


app.get(BASE_URL, (req, res) => {
    res.send("Oof");
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