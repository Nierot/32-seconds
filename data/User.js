class User {
    constructor() {
        this.team = undefined;
        this.name = undefined;
    }

    setTeam(team) {
        this.team = team;
    }

    toString() {
        return `User ${this.name} from team ${this.team}`;
    }
}

module.exports = User;