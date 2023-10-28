import {ICacheable} from "../caches/SimpleCache";
import {jsonArrayMember, jsonMember, jsonObject, TypedJSON} from "typedjson";
import {CustomDeserializerParams} from "typedjson/lib/types/metadata";


export enum GameModeType {
    NONE = "none",
    QUICK_MATCH_1_V_1 = "qm_1v1",
    QUICK_MATCH_2_V_2 = "qm_2v2",
    QUICK_MATCH_3_V_3 = "qm_3v3",
    QUICK_MATCH_4_V_4 = "qm_4v4",

    RANKED_MATCH_SOLO = "rm_solo",
    RANKED_MATCH_TEAM = "rm_team",
    RANKED_MATCH_TEAM_2_V_2_ELO = "rm_2v2_elo",
    RANKED_MATCH_TEAM_3_V_3_ELO = "rm_3v3_elo",
    RANKED_MATCH_TEAM_4_V_4_ELO = "rm_4v4_elo",
}
export function GameModeTypeIsQM(mode: GameModeType): boolean {
    switch (mode) {
        case GameModeType.QUICK_MATCH_1_V_1:
        case GameModeType.QUICK_MATCH_2_V_2:
        case GameModeType.QUICK_MATCH_3_V_3:
        case GameModeType.QUICK_MATCH_4_V_4:
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
export class GameModeSeason {
    mode: GameModeType
    @jsonMember(String, {name: "rank_level"})
    readonly rank: Rank
    @jsonMember({name: "max_rating"})
    readonly maxRating: number
    @jsonMember({name: "max_rating_1m"})
    readonly maxRating1M: number
    @jsonMember({name: "max_rating_7d"})
    readonly maxRating7D: number
    @jsonMember({name: "games_count"})
    readonly gameCount: number
    @jsonMember({name: "wins_count"})
    readonly winCount: number
    @jsonMember({name: "streak"})
    readonly winStreak: number

    constructor(mode: GameModeType, rank: Rank, maxRating: number, maxRating1M: number, maxRating7D: number, gameCount: number, winCount: number, winStreak: number) {
        this.mode = mode;
        this.rank = rank;
        this.maxRating = maxRating;
        this.maxRating1M = maxRating1M;
        this.maxRating7D = maxRating7D;
        this.gameCount = gameCount;
        this.winCount = winCount;
        this.winStreak = winStreak;
    }
}

function GameModeListDeserializer(
    modeListJson: any,
    params: CustomDeserializerParams,
) {
    if (!modeListJson) {
        return;
    }
    const modes: GameMode[] = [];
    for (const key in modeListJson) {
        const mode = key as GameModeType ?? GameModeType.NONE;
        if (mode == GameModeType.NONE) {
            continue;
        }
        const modeJson = modeListJson[mode];

        const current = GameModeSeasonSerializer.parse(modeJson);
        const seasons: GameModeSeason[] = [current!]
        if (modeJson.previous_seasons !== undefined && modeJson.previous_seasons !== null && modeJson.previous_seasons.length > 0) {
            seasons.push(...GameModeSeasonSerializer.parseAsArray(modeJson.previous_seasons));
        }
        seasons.forEach(v => v.mode = mode);
        const gm = new GameMode(
            mode,
            current!,
            seasons,
        )

        modes.push(gm);
    }

    return modes;
}
export class GameMode {
    constructor(
        readonly mode: GameModeType,
        readonly current: GameModeSeason,
        readonly seasons: GameModeSeason[],
    ) {
    }
}

@jsonObject()
export class SimplifiedGameModeSeason {
    mode: GameModeType
    @jsonMember(String, {name: "rank_level"})
    readonly rank: Rank
    @jsonMember({name: "rating"})
    readonly maxRating: number
    @jsonMember({name: "games_count"})
    readonly gameCount: number
    @jsonMember({name: "wins_count"})
    readonly winCount: number
    @jsonMember({name: "streak"})
    readonly winStreak: number

    constructor(mode: GameModeType, rank: Rank, maxRating: number, gameCount: number, winCount: number, winStreak: number) {
        this.mode = mode;
        this.rank = rank;
        this.maxRating = maxRating;
        this.gameCount = gameCount;
        this.winCount = winCount;
        this.winStreak = winStreak;
    }
}
export class SimplifiedGameMode {
    constructor(
        readonly mode: GameModeType,
        readonly current: SimplifiedGameModeSeason,
        readonly seasons: SimplifiedGameModeSeason[],
    ) {
    }
}
function SimplifiedGameModeDeserializer(
    modeListJson: any,
    params: CustomDeserializerParams,
) {
    if (!modeListJson) {
        return;
    }
    const modes: SimplifiedGameMode[] = [];
    for (const key in modeListJson) {
        const mode = key as GameModeType ?? GameModeType.NONE;
        if (mode == GameModeType.NONE) {
            continue;
        }
        const modeJson = modeListJson[mode];

        const current = SimplifiedGameModeSeasonSerializer.parse(modeJson);
        const seasons: SimplifiedGameModeSeason[] = [current!]
        if (modeJson.previous_seasons !== undefined && modeJson.previous_seasons !== null && modeJson.previous_seasons.length > 0) {
            seasons.push(...SimplifiedGameModeSeasonSerializer.parseAsArray(modeJson.previous_seasons));
        }
        seasons.forEach(v => v.mode = mode);
        const gm = new SimplifiedGameMode(
            mode,
            current!,
            seasons,
        )

        modes.push(gm);
    }

    return modes;
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
        null,
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
    @jsonArrayMember(GameMode, {name: "modes", deserializer: GameModeListDeserializer})
    readonly modeList: GameMode[]| null
    @jsonArrayMember(SimplifiedGameMode, {name: "leaderboards", deserializer: SimplifiedGameModeDeserializer})
    readonly simplifiedModeList: SimplifiedGameMode[]| null

    private _modes: Map<GameModeType, GameMode>| null = null
    get modes(): Map<GameModeType, GameMode>| null {
        if (this._modes || this.modeList == null) {
            return this._modes;
        }

        this._modes = new Map<GameModeType, GameMode>();
        for (let i = 0; i < this.modeList.length; i++) {
            const mode = this.modeList[i];
            this._modes.set(mode.mode, mode);
        }
        return this._modes;
    }
    private _simplifiedModes: Map<GameModeType, SimplifiedGameMode>| null = null
    get simplifiedModes(): Map<GameModeType, SimplifiedGameMode>| null {
        if (this._simplifiedModes || this.simplifiedModeList == null) {
            return this._simplifiedModes;
        }

        this._simplifiedModes = new Map<GameModeType, SimplifiedGameMode>();
        for (let i = 0; i < this.simplifiedModeList.length; i++) {
            const mode = this.simplifiedModeList[i];
            this._simplifiedModes.set(mode.mode, mode);
        }
        return this._simplifiedModes;
    }
    get cacheKey(): number {
        return this.aoe4WorldId;
    }
    get fullAvatarImageUrl(): string {
        return this.avatars?.full ?? "";
    }
    get mediumAvatarImageUrl(): string {
        return this.avatars?.medium ?? "";
    }
    get smallAvatarImageUrl(): string {
        return this.avatars?.small ?? "";
    }

    constructor(aoe4WorldId: number, steamId: string | null, username: string, avatars: UserAvatar | null, modeList: GameMode[] | null, simplifiedModeList: SimplifiedGameMode[] | null) {
        this.aoe4WorldId = aoe4WorldId;
        this.steamId = steamId;
        this.username = username;
        this.avatars = avatars;
        this.modeList = modeList;
        this.simplifiedModeList = simplifiedModeList;
    }

    isNull(): boolean {
        return this.aoe4WorldId == User.NULL_AOE4WORLD_ID;
    }
    recentRank(isSolo: boolean): Rank {
        if (this.modes != null) {
            let mode: GameMode| null = null;
            if (isSolo) {
                mode = this.modes.get(GameModeType.RANKED_MATCH_SOLO) ?? null;
            } else {
                mode = this.modes.get(GameModeType.RANKED_MATCH_TEAM) ?? null;
            }
            if (mode == null) {
                return Rank.NONE;
            }
            return mode.current.rank;
        }
        if (this.simplifiedModes != null) {
            let mode: SimplifiedGameMode| null = null;
            if (isSolo) {
                mode = this.simplifiedModes.get(GameModeType.RANKED_MATCH_SOLO) ?? null;
            } else {
                mode = this.simplifiedModes.get(GameModeType.RANKED_MATCH_TEAM) ?? null;
            }
            if (mode == null) {
                return Rank.NONE;
            }
            return mode.current.rank;
        }
        return Rank.NONE;
    }
    averageRecentQMRating(autoRound: boolean = false): number {
        let qmRatingsMax: number = 0
        let qmRatingsCount: number = 0

        if (this.modes != null) {
            this.modes.forEach((value, key) => {
                if (GameModeTypeIsQM(value.mode)) {
                    qmRatingsMax += value.current.maxRating;
                    qmRatingsCount += 1;
                }
            })
        } else if (this.simplifiedModes != null) {
            this.simplifiedModes.forEach((value, key) => {
                if (GameModeTypeIsQM(value.mode)) {
                    qmRatingsMax += value.current.maxRating;
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
        if (this.modes != null) {
            let mode: GameMode| null = null;
            if (isSolo) {
                mode = this.modes.get(GameModeType.RANKED_MATCH_SOLO) ?? null;
            } else {
                mode = this.modes.get(GameModeType.RANKED_MATCH_TEAM) ?? null;
            }
            if (mode == null) {
                return 0;
            }
            return mode.current.maxRating;
        }
        if (this.simplifiedModes != null) {
            let mode: SimplifiedGameMode| null = null;
            if (isSolo) {
                mode = this.simplifiedModes.get(GameModeType.RANKED_MATCH_SOLO) ?? null;
            } else {
                mode = this.simplifiedModes.get(GameModeType.RANKED_MATCH_TEAM) ?? null;
            }
            if (mode == null) {
                return 0;
            }
            return mode.current.maxRating;
        }
        return 0;
    }
}


export const GameModeSeasonSerializer = new TypedJSON(GameModeSeason);
export const SimplifiedGameModeSeasonSerializer = new TypedJSON(SimplifiedGameModeSeason);
export const UserSerializer = new TypedJSON(User);