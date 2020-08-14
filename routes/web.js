module.exports = {
    game: (req, res) => {
        res.render('index')
    },
    
    e404: (req, res) => {
        res.sendFile('static/404.html', {
            root: '.'
        })
    }
}