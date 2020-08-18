module.exports = {
    game: (req, res) => {
        // if (process.users.length > 1) {
            // res.render('lobby');
        // } else {
            res.render('index');
        // }
    },
    
    e404: (req, res) => {
        res.sendFile('static/404.html', {
            root: '.'
        })
    }
}