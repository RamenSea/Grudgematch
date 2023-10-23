import {jsonArrayMember, jsonMember, jsonObject, TypedJSON} from "typedjson";
import {id} from "inversify";
import {CustomDeserializerParams} from "typedjson/lib/types/metadata";


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

function DidWinDeserializer(
    json: string,
    params: CustomDeserializerParams,
) {
    return json == "win";
}
@jsonObject()
export class Player {
    @jsonMember({name: "profile_id"})
    readonly aoe4WorldId: number
    @jsonMember({name: "name"})
    readonly username: string
    @jsonMember(String)
    readonly civilization: Civilization
    @jsonMember(String, {name: "result", deserializer: DidWinDeserializer})
    readonly didWin: boolean

    teamId: number = -1;

    constructor(aoe4WorldId: number, username: string, civilization: Civilization, didWin: boolean) {
        this.aoe4WorldId = aoe4WorldId;
        this.username = username;
        this.civilization = civilization;
        this.didWin = didWin;
    }
}

export class Team {
    constructor(
        readonly teamNumber: number,
        public players: Array<Player>,
    ) {
    }
}
function TeamDeserializer(
    json: Array<any>,
    params: CustomDeserializerParams,
) {
    const players: Player[] = [];
    for (let i = 0; i < json.length; i++) {
        const teamSetJson = json[i].map((v: any) => v.player);
        const teamSet = PlayerSerializer.parseAsArray(teamSetJson);
        teamSet.forEach(value => {
            value.teamId = i;
        })
        players.push(...teamSet);
    }
    // console.log(json, players);
    return players;
}

@jsonObject()
export class Game {
    @jsonMember({name: "game_id"})
    readonly id: number
    @jsonMember({name: "ongoing"})
    readonly isPlaying: boolean

    @jsonArrayMember(Player, {name: "teams", deserializer: TeamDeserializer})
    readonly players: Array<Player>


    private cachedTeamValue: Team[]|null = null;
    private cachedWinningTeam: number = -10;

    constructor(id: number, isPlaying: boolean, players: Array<Player>) {
        this.id = id;
        this.isPlaying = isPlaying;
        this.players = players;
    }

    get winningTeam(): number {
        if (this.cachedWinningTeam >= NULL_TEAM_ID) {
            return this.cachedWinningTeam;
        }

        this.cachedWinningTeam = NULL_TEAM_ID;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].didWin) {
                this.cachedWinningTeam = this.players[i].teamId;
                break;
            }
        }
        return this.cachedWinningTeam;
    }
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
}

export const PlayerSerializer = new TypedJSON(Player);
export const GameSerializer = new TypedJSON(Game);
