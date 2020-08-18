class User {
    constructor(id, socket) {
        this.socket = socket;
        this.id = id;
        this.team = undefined;
        this.name = undefined;
    }

    setTeam(team) {
        this.team = team;
    }

    toString() {
        return `User ${this.name} from team ${this.team}`;
    }

    equals(obj) {
        return obj.id === this.id; 
    }
}

module.exports = User;