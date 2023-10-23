import {jsonMember, jsonObject} from "typedjson";


export enum Civilization {
    NONE = "none",
    ABBASID_DYNASTY = "abbasid_dynasty",
    CHINESE = "chinese",
    DELHI_SULTANATE = "delhi_sultanate",
    ENGLISH = "english",
    FRENCH = "french",
    HOLY_ROMAN_EMPIRE = "holy_roman_empire",
    MALIANS = "malians",
    MONGOLS = "mongols",
    OTTOMANS = "ottomans",
    RUS = "rus",
}
export const NULL_TEAM_ID = -1;

// @jsonObject()
// export class Player {
//     @jsonMember({name: "profile_id"})
//     readonly aoe4WorldId: number
//     @jsonMember({name: "name"})
//     readonly username: string
//     @jsonMember(String)
//     readonly civilization: Civilization
//
//     teamId: number = -1;
//
//
//     constructor(aoe4WorldId: number, username: string, civilization: Civilization, teamId: number) {
//         this.aoe4WorldId = aoe4WorldId;
//         this.username = username;
//         this.civilization = civilization;
//         this.teamId = teamId;
//     }
// }

export class Player {

    constructor(
        readonly aoe4WorldId: number,
        readonly username: string,
        readonly teamId: number,
        readonly civilization: Civilization,
    ) {
    }

    static FromJson(teamId: number, jsonObject: any): Player {

        return new Player(
            jsonObject.profile_id,
            jsonObject.name,
            teamId,
            jsonObject.civilization as Civilization ?? Civilization.NONE, //todo test null state
        );
    }
}

export class Team {
    constructor(
        readonly teamNumber: number,
        public players: Array<Player>,
    ) {
    }
}

export class Game {
    constructor(
        readonly id: number,
        readonly isPlaying: boolean,
        public players: Array<Player>,
        public winningTeam: number,
    ) {
    }

    private cachedTeamValue: Team[]|null = null;
    get teams():  Team[] {
        if (this.cachedTeamValue !== null) {
            return this.cachedTeamValue;
        }
        const t:  Team[] = [];
        for (let i = 0; i < this.players.length; i++) {
            const p = this.players[i];
            while (t.length <= p.teamId) {
                t.push(new Team(t.length, []))
            }
            t[p.teamId].players.push(p);
        }
        this.cachedTeamValue = t;
        return t;
    }
    getPlayerById(aoe4Id: number): Player|null {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].aoe4WorldId == aoe4Id) {
                return this.players[i];
            }
        }
        return null;
    }
    static FromJson(jsonObject: any): Game {
        let winningTeam = NULL_TEAM_ID;

        const players = new Array<Player>();
        for (let i = 0; i < jsonObject.teams.length; i++) {
            const team = jsonObject.teams[i];
            for (let playerIndex = 0; playerIndex < team.length; playerIndex++) {
                const playerJson = team[playerIndex].player;
                if (playerJson.result !== undefined && playerJson.result === "win") {
                    winningTeam = i;
                }
                const player = Player.FromJson(i, playerJson);
                players.push(player);
            }
        }
        return new Game(
            jsonObject.game_id,
            jsonObject.ongoing,
            players,
            winningTeam
        );
    }
}