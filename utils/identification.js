module.exports = {

    generateGameCode: () => {
        return module.exports._generateRandomString(4);
    },

    generateUserID: () => {
        return module.exports._generateRandomString(20);
    },

    _generateRandomString: length => {
        charSet = 'abcdefghijklmnopqrstuvwxyz';
        var randomString = '';
        for (var i = 0; i < length; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
    },
}