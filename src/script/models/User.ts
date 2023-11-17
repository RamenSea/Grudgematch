import {ICacheable} from "../caches/SimpleCache";
import {jsonMapMember, jsonMember, jsonObject, MapShape, TypedJSON} from "typedjson";


export enum GameModeType {
    NONE = "none",
    CUSTOM = "custom",
    QUICK_MATCH_1_V_1 = "qm_1v1",
    QUICK_MATCH_2_V_2 = "qm_2v2",
    QUICK_MATCH_3_V_3 = "qm_3v3",
    QUICK_MATCH_4_V_4 = "qm_4v4",

    QUICK_MATCH_1_V_1_EMPIRE_WAR = "qm_1v1_ew",
    QUICK_MATCH_2_V_2_EMPIRE_WAR = "qm_2v2_ew",
    QUICK_MATCH_3_V_3_EMPIRE_WAR = "qm_3v3_ew",
    QUICK_MATCH_4_V_4_EMPIRE_WAR = "qm_4v4_ew",

    RANKED_MATCH_SOLO = "rm_solo",
    RANKED_MATCH_TEAM = "rm_team",
    RANKED_MATCH_TEAM_1_V_1_ELO = "rm_1v1_elo",
    RANKED_MATCH_TEAM_2_V_2_ELO = "rm_2v2_elo",
    RANKED_MATCH_TEAM_3_V_3_ELO = "rm_3v3_elo",
    RANKED_MATCH_TEAM_4_V_4_ELO = "rm_4v4_elo",

    QUICK_MATCH_1_V_1_CONSOLE = "qm_1v1_console",
    QUICK_MATCH_2_V_2_CONSOLE = "qm_2v2_console",
    QUICK_MATCH_3_V_3_CONSOLE = "qm_3v3_console",
    QUICK_MATCH_4_V_4_CONSOLE = "qm_4v4_console",

    QUICK_MATCH_1_V_1_EMPIRE_WAR_CONSOLE = "qm_1v1_ew_console",
    QUICK_MATCH_2_V_2_EMPIRE_WAR_CONSOLE = "qm_2v2_ew_console",
    QUICK_MATCH_3_V_3_EMPIRE_WAR_CONSOLE = "qm_3v3_ew_console",
    QUICK_MATCH_4_V_4_EMPIRE_WAR_CONSOLE = "qm_4v4_ew_console",

    RANKED_MATCH_SOLO_CONSOLE = "rm_solo_console",
    RANKED_MATCH_TEAM_CONSOLE = "rm_team_console",
    RANKED_MATCH_TEAM_1_V_1_CONSOLE = "rm_1v1_console",
    RANKED_MATCH_TEAM_2_V_2_CONSOLE = "rm_2v2_console",
    RANKED_MATCH_TEAM_3_V_3_CONSOLE = "rm_3v3_console",
    RANKED_MATCH_TEAM_4_V_4_CONSOLE = "rm_4v4_console",
}

export function GameModeTypeIsQM(mode: GameModeType): boolean {
    switch (mode) {
        case GameModeType.QUICK_MATCH_1_V_1:
        case GameModeType.QUICK_MATCH_2_V_2:
        case GameModeType.QUICK_MATCH_3_V_3:
        case GameModeType.QUICK_MATCH_4_V_4:

        case GameModeType.QUICK_MATCH_1_V_1_EMPIRE_WAR:
        case GameModeType.QUICK_MATCH_2_V_2_EMPIRE_WAR:
        case GameModeType.QUICK_MATCH_3_V_3_EMPIRE_WAR:
        case GameModeType.QUICK_MATCH_4_V_4_EMPIRE_WAR:

        case GameModeType.QUICK_MATCH_1_V_1_CONSOLE:
        case GameModeType.QUICK_MATCH_2_V_2_CONSOLE:
        case GameModeType.QUICK_MATCH_3_V_3_CONSOLE:
        case GameModeType.QUICK_MATCH_4_V_4_CONSOLE:

        case GameModeType.QUICK_MATCH_1_V_1_EMPIRE_WAR_CONSOLE:
        case GameModeType.QUICK_MATCH_2_V_2_EMPIRE_WAR_CONSOLE:
        case GameModeType.QUICK_MATCH_3_V_3_EMPIRE_WAR_CONSOLE:
        case GameModeType.QUICK_MATCH_4_V_4_EMPIRE_WAR_CONSOLE:
            return true;
    }
    return false;
}
export enum Rank {
    NONE = "none",
    UNRANKED = "unranked",
    BRONZE_1 = "bronze_1",
    BRONZE_2 = "bronze_2",
    BRONZE_3 = "bronze_3",
    SILVER_1 = "silver_1",
    SILVER_2 = "silver_2",
    SILVER_3 = "silver_3",
    GOLD_1 = "gold_1",
    GOLD_2 = "gold_2",
    GOLD_3 = "gold_3",
    PLATINUM_1 = "platinum_1",
    PLATINUM_2 = "platinum_2",
    PLATINUM_3 = "platinum_3",
    DIAMOND_1 = "diamond_1",
    DIAMOND_2 = "diamond_2",
    DIAMOND_3 = "diamond_3",
    CONQUEROR_1 = "conqueror_1",
    CONQUEROR_2 = "conqueror_2",
    CONQUEROR_3 = "conqueror_3",

}

@jsonObject()
export class GameSeason {
    @jsonMember(String, {name: "rank_level"})
    rank: Rank
    @jsonMember({name: "max_rating"})
    private _maxRating: number|undefined = undefined
    @jsonMember({name: "rating"})
    readonly rating: number|undefined
    @jsonMember({name: "max_rating_1m"})
    readonly maxRating1M: number|undefined
    @jsonMember({name: "max_rating_7d"})
    readonly maxRating7D: number|undefined
    @jsonMember({name: "games_count"})
    readonly gameCount: number|undefined
    @jsonMember({name: "wins_count"})
    readonly winCount: number|undefined
    @jsonMember({name: "streak"})
    readonly winStreak: number|undefined

    constructor(rank: Rank, maxRating1M: number, maxRating7D: number, gameCount: number, winCount: number, winStreak: number) {
        this.rank = rank;
        this.maxRating1M = maxRating1M;
        this.maxRating7D = maxRating7D;
        this.gameCount = gameCount;
        this.winCount = winCount;
        this.winStreak = winStreak;
    }
}

@jsonObject()
export class UserAvatar {
    @jsonMember
    readonly full: string|null
    @jsonMember
    readonly medium: string|null
    @jsonMember
    readonly small: string|null

    constructor(full: string|null = null, medium: string|null = null, small: string|null = null) {
        this.full = full;
        this.medium = medium;
        this.small = small;
    }
}
@jsonObject()
export class User implements ICacheable<number>{
    public static MIN_USERNAME_LENGTH = 3;
    public static NULL_AOE4WORLD_ID = -1;
    public static NULL_STEAM_ID = "-1";
    public static readonly NULL_USER = new User(
        User.NULL_AOE4WORLD_ID,
        User.NULL_STEAM_ID,
        "NULL",
        null,
    )

    @jsonMember({name: "profile_id"})
    readonly aoe4WorldId: number
    @jsonMember({name: "steam_id"})
    readonly steamId: string|null
    @jsonMember({name: "name"})
    readonly username: string
    @jsonMember(UserAvatar)
    readonly avatars: UserAvatar|null

    @jsonMapMember(String, GameSeason, {shape: 1 as MapShape})
    modes: Map<GameModeType, GameSeason>| null = null
    @jsonMapMember(String, GameSeason, {shape: 1 as MapShape})
    leaderboards: Map<GameModeType, GameSeason>| null = null

    get cacheKey(): number {
        return this.aoe4WorldId;
    }
    get fullAvatarImageUrl(): string |null{
        return this.avatars?.full ?? null;
    }
    get mediumAvatarImageUrl(): string|null {
        return this.avatars?.medium ?? null;
    }
    get smallAvatarImageUrl(): string|null {
        return this.avatars?.small ?? null;
    }

    constructor(aoe4WorldId: number, steamId: string | null, username: string, avatars: UserAvatar | null) {
        this.aoe4WorldId = aoe4WorldId;
        this.steamId = steamId;
        this.username = username;
        this.avatars = avatars;
    }

    isNull(): boolean {
        return this.aoe4WorldId == User.NULL_AOE4WORLD_ID;
    }
    recentRank(isSolo: boolean): Rank {
        let m = this.modes != null ? this.modes : this.leaderboards;
        if (m != null) {
            let mode: GameSeason| null = null;
            if (isSolo) {
                mode = m.get(GameModeType.RANKED_MATCH_SOLO) ?? null;
            } else {
                mode = m.get(GameModeType.RANKED_MATCH_TEAM) ?? null;
            }
            if (mode == null) {
                return Rank.NONE;
            }
            return mode.rank;
        }
        return Rank.NONE;
    }
    averageRecentQMRating(autoRound: boolean = false): number {
        let qmRatingsMax: number = 0
        let qmRatingsCount: number = 0

        const m = this.modes != null ? this.modes : this.leaderboards;
        if (m != null) {
            m.forEach((value, key) => {
                if (GameModeTypeIsQM(key) && value.rating) {
                    qmRatingsMax += value.rating;
                    qmRatingsCount += 1;
                }
            })
        }

        if (qmRatingsCount == 0) {
            return 0;
        }
        const avg = qmRatingsMax / qmRatingsCount;
        if (autoRound) {
            return Math.round(avg);
        }
        return avg;
    }
    recentRating(isSolo: boolean): number {
        const m = this.modes != null ? this.modes : this.leaderboards;
        if (m != null) {
            let mode: GameSeason | null = null;
            if (isSolo) {
                mode = m.get(GameModeType.RANKED_MATCH_SOLO) ?? null;
            } else {
                mode = m.get(GameModeType.RANKED_MATCH_TEAM) ?? null;
            }
            if (mode == null) {
                return 0;
            }
            return mode.rating ?? 0;
        }
        return 0;
    }
}


export const UserSerializer = new TypedJSON(User);