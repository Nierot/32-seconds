const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const random = require('./random');
const { info, error, verbose } = require('nielog').Log;

class DatabaseHelper {
    #db = undefined;

    constructor() {
    }

    async init() {
        this.#db = await sqlite.open({
            filename: 'data.db',
            driver: sqlite3.Database
        })
        await this.#db.exec('CREATE TABLE IF NOT EXISTS words(word, list)');
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
        info(options);
        const res = await this.#db.all('SELECT * FROM words WHERE list = ? ORDER BY RANDOM() LIMIT ?;', [options.list, options.amount]);
        return this._parseWords(res);
    }

    async getAllWords(list) {
        return new Promise(async (res, rej) => {
            try {
                const words = await this.#db.all('SELECT * FROM words WHERE list = ?', [list]);
                res(this._parseWords(words));
            } catch (err) {
                rej(err);
            }
        })
    }

    async insertWord(word, list) {
        await this.#db.all('INSERT INTO words(word, list) VALUES(?, ?)', [word, list]);
    }

    async addList(list) {
        list.words.forEach(async word => this.insertWord(word, list.name)); 
    }

    async getAllListsWithWords() {
        let res = [];
        let words = await this._dumpWordList();
        let lists = await this.getAllAvailableListNames();
        lists.forEach(list => 
            res.push({ 
                name: list,
                words: words.filter(word => word.list === list)
                            .map(word => { return word.word })
                }));
        return res;
    }

    async getAllAvailableListNames() {
        let res = [];
        let words = await this._dumpWordList();
        words.forEach(item => res.includes(item.list) ? false : res.push(item.list))
        return res;
    }

    async _dumpWordList() {
        return await this.#db.all('SELECT * FROM words');
    }

    _parseWords(list) {
        let result = []
        list.forEach(obj => result.push(obj.word));
        return result;
    }

}


module.exports = new Promise(async (resolve, reject) => {
    try {
        let obj = await new DatabaseHelper().init();
        resolve(obj);
    } catch (err) {
        reject(err);
    }
});