const fetch = require('node-fetch');
const settings = require('../settings.json');

module.exports = {
    getGamecode: async port => {
        return new Promise((resolve, reject) => {
            fetch(settings.gamehub.gamecode_uri)
                .then(gamecode => resolve(gamecode))
                .catc(err => reject(err));
        })
    }
}