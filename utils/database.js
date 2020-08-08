const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

class DatabaseHelper {
    #db = undefined;

    async init() {
        this.#db = await sqlite.open({
            filename: 'data.db',
            driver: sqlite3.Database
        })
        await this.#db.exec('CREATE TABLE IF NOT EXISTS words(word, list)');
        await this.#db.exec('CREATE TABLE IF NOT EXISTS lists(userId, list)');
        sqlite3.verbose();
        return this;
    }

    /**
     * Gets a list of words from the database,
     * according to the given options
     * @param {*} options Object with list and amount param
     * default:
     * {
     *      amount: 5
     *      list: undefined
     * }
     *  
     */
    async getWords(options) {
        const res = await this.#db.all('SELECT * FROM words WHERE list = ? LIMIT ?;', [options.list, options.amount]);
        return this._parseWords(res);
    }

    async getLists(userId) {
        const res = await this.#db.all('SELECT * FROM lists WHERE userId = ?', [userId]);
        return this._parseLists(res);
    }

    async getAllListsWithWords(userId) {
        let listIds = await this.getLists(userId);
        let result = {};
        listIds.forEach(async list => {
            let wordList = await this.getWords(list);
            result[list] = wordList;
        })
        return result;
    }

    _parseWords(list) {
        let result = []
        list.forEach(obj => result.push(obj.word));
        return result;
    }

    _parseLists(list) {
        let result = []
        list.forEach(obj => result.push(obj.list));
        return result;
    }
}


module.exports = new DatabaseHelper().init();