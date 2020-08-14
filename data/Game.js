class Game {

    constructor(gameCode) {
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
            amountOfRoundsPerTeam: 5,
            gameCode: gameCode,
            playerIDs: {
                playerOne: undefined,
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
}

module.exports = Game;