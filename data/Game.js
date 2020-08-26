const random = require('../utils/random');

class Game {

    MINIMUM_ROUNDS = 1;
    MAXIMUM_ROUNDS = 24;
    MINIMUM_WORDS = 1;
    MAXIMUM_WORDS = 8;
    MINIMUM_TIME = 10;
    MAXIMUM_TIME = 60;
    MINIMUM_PLAYERS = 1;
    MAXIMUM_PLAYERS = 8;

    constructor(gameCode, playerOne) {
        this.state = {
            roundsPlayed: 0,
            scores: {
                teamOne: 0,
                teamTwo: 0
            }
        };

        this.words = [];

        this.settings = {
            dualPhone: false,
            amountOfWords: '5',
            amountOfRoundsPerTeam: '8',
            timePerRound: '32',
            amountOfPlayersPerTeam: '4',
            allowSpectators: true,
            gameCode: gameCode,
            playerIDs: {
                playerOne: playerOne,
                playerTwo: undefined
            },
            teams: {
                teamOne: [],
                teamTwo: []
            },
            teamNames: {
                teamOne: '',
                teamTwo: ''
            },
            lists: []
        };

    }

    addList(list) {
        this.settings.lists.push(list);
        return process.lists
                .filter(obj => { return obj.name === list })
                .map(obj => { return obj.words })
    }

    getWords(amount) {
        let result = [];
        for (i = 0; i < amount; i++) {
            result.push(this._getWord());
            if (this.words.length === 0) {
                break;
            }
        }
        return result;
    }

    _getWord() {
        let int = random.randomInteger(0, this.words.length);
        let word = this.words[int];
        delete this.words[int];
        return word;
    }

    incrementScore(scored, team) {
        if (team === 1) this.state.scores.teamOne += scored;
        else if (team === 2) this.state.scores.teamTwo += scored;
        else throw new Error('Not a valid team');
    }

    addPlayer(player, team) {
        if (team === 1) this.settings.teams.teamOne.push(player);
        else if (team === 2) this.settings.teams.teamTwo.push(player);
        else throw new Error('Not a valid team');
    }

    setTeamOne(id) {
        this.settings.playerIDs.teamOne = id;
    }

    setTeamTwo(id) {
        this.settings.playerIDs.teamTwo = id;
    }

    isTeamOne(id) {
        return this.settings.teams.teamOne === id;
    }

    setTeamNameOne(name) {
        this.settings.teamNames.teamOne = name;
    }

    setTeamNameTwo(name) {
        this.settings.teamNames.teamTwo = name;
    }

    setTimePerRound(time) {
        if (time > this.MAXIMUM_TIME || time < this.MINIMUM_TIME) {
            return false;
        } else {
            this.settings.timePerRound = time;
            return true;
        }
    }

    setAmountOfRoundsPerTeam(rounds) {
        if (rounds > this.MAXIMUM_ROUNDS || rounds < this.MINIMUM_ROUNDS) {
            return false;
        } else {
            this.settings.amountOfRoundsPerTeam = rounds;
            return true;
        }
    }

    setAmountOfWords(words) {
        if (words > this.MAXIMUM_WORDS || words < this.MINIMUM_WORDS) {
            return false;
        } else {
            this.settings.amountOfWords = words;
            return true;
        }
    }

    setAmountOfPlayersPerTeam(players) {
        if (players > this.MAXIMUM_PLAYERS || players < this.MINIMUM_PLAYERS) {
            return false;
        } else {
            this.settings.amountOfPlayersPerTeam = players;
            return true;
        }
    }

    setDualPhones(phones) {
        this.settings.dualPhone = phones;
    }

    setAllowSpectators(spectators) {
        this.settings.allowSpectators = spectators;
    }

    toJson() {
        return {
            state: this.state,
            settings: this.settings
        }
    }

    toString() {
        return JSON.stringify(this.toJson())
    }
}

module.exports = Game;