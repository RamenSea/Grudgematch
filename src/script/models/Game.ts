import {jsonArrayMember, jsonMember, jsonObject, TypedJSON} from "typedjson";
import {id} from "inversify";
import {CustomDeserializerParams} from "typedjson/lib/types/metadata";


export enum Civilization {
    NONE = "none",
    UNKNOWN = "unknown",
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
    BYZANTINES = "byzantines",
    JAPANESE = "japanese",
    JEANNE_DARC = "jeanne_darc",
    AYYUBIDS = "ayyubids",
    ZHU_XIS_LEGACY = "zhu_xis_legacy",
    ORDER_OF_THE_DRAGON = "order_of_the_dragon"
}
const CivilizationKeys = Object.values(Civilization);

export function ParseCivilizationEnum(v: string): Civilization {
    if (CivilizationKeys.includes(v as Civilization)) {
        return v as Civilization;
    }
    return Civilization.UNKNOWN;
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
    @jsonMember(String, {deserializer: ParseCivilizationEnum})
    readonly civilization: Civilization
    @jsonMember(String, {name: "result", deserializer: DidWinDeserializer})
    readonly didWin: boolean
    @jsonMember
    readonly rating: number
    @jsonMember({name: "rating_diff"})
    readonly ratingDiff: number

    teamId: number = -1;

    constructor(aoe4WorldId: number, username: string, civilization: Civilization, didWin: boolean, rating: number, ratingDiff: number) {
        this.aoe4WorldId = aoe4WorldId;
        this.username = username;
        this.civilization = civilization;
        this.didWin = didWin;
        this.rating = rating;
        this.ratingDiff = ratingDiff;
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
    return players;
}

@jsonObject()
export class Game {
    @jsonMember({name: "game_id"})
    readonly id: number
    @jsonMember({name: "ongoing"})
    readonly isPlaying: boolean
    @jsonMember({name: "duration"})
    readonly duration: number
    @jsonMember(Date,{name: "started_at"})
    readonly startedAt: Date

    @jsonArrayMember(Player, {name: "teams", deserializer: TeamDeserializer})
    readonly players: Array<Player>


    private cachedTeamValue: Team[]|null = null;
    private cachedWinningTeam: number = NULL_TEAM_ID - 1;
    private cachedEndDate: Date| null = null;

    constructor(id: number, isPlaying: boolean, duration: number, startedAt: Date, players: Array<Player>) {
        this.id = id;
        this.isPlaying = isPlaying;
        this.duration = duration;
        this.startedAt = startedAt;
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
    get endDate(): Date {
        if (this.isPlaying || this.duration == undefined) {
            return this.startedAt
        }

        this.cachedEndDate = new Date(this.startedAt.getTime() + this.duration);
        return this.cachedEndDate;
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
