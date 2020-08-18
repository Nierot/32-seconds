class Game {

    MINIMUM_ROUNDS = 1;
    MAXIMUM_ROUNDS = 20;
    MINIMUM_WORDS = 1;
    MAXIMUM_WORDS = 8;
    MINIMUM_TIME = 10;
    MAXIMUM_TIME = 60;

    constructor(gameCode, playerOne) {
        this.state = {
            roundsPlayed: 0,
            scores: {
                teamOne: 0,
                teamTwo: 0
            }
        };

        this.settings = {
            dualPhone: false,
            amountOfWords: 5,
            amountOfRoundsPerTeam: 8,
            timePerRound: 32,
            allowSpectators: true,
            gameCode: gameCode,
            playerIDs: {
                playerOne: playerOne,
                playerTwo: undefined
            },
            teams: {
                teamOne: [],
                teamTwo: []
            }
        };

    }

    incrementScoreTeamOne(scored, team) {
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
}

module.exports = Game;