var app = require('express')();
var http = require('http').createServer(app);

const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/static/*', (req, res) => {
    res.sendFile(__dirname + req.url);
})

http.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});