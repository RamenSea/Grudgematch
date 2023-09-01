

export enum Civilization {
    NONE = "none",
    ABBASID_DYNASTY = "abbasid_dynasty",
    CHINESE = "chinese",
    DELHI_SULTANATE = "delhi_sultanate",
    ENGLISH = "english",
    FRANCE = "france",
    HOLY_ROMAN_EMPIRE = "holy_roman_empire",
    MALIANS = "malians",
    MONGOLS = "mongols",
    OTTOMANS = "ottomans",
    RUS = "rus",
}
export const NULL_TEAM_ID = -1;

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


export class Game {
    constructor(
        readonly id: number,
        readonly isPlaying: boolean,
        public players: Array<Player>,
        public winningTeam: number,
    ) {
    }

    static FromJson(jsonObject: any): Game {
        let winningTeam = NULL_TEAM_ID;

        const players = new Array<Player>();
        for (let i = 0; i < jsonObject.teams.length; i++) {
            const team = jsonObject.teams[i];
            for (let playerIndex = 0; i < team.length; playerIndex++) {
                const playerJson = team[playerIndex];
                if (playerJson.result === "win") {
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