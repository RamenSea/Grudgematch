import {ICacheable} from "../caches/SimpleCache";
import {Civilization} from "./Game";


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
export class GameModeSeason {
    constructor(
        readonly mode: GameModeType,
        readonly rank: Rank,
        readonly maxRating: number,
        readonly maxRating1M: number,
        readonly maxRating7D: number,
        readonly gameCount: number,
        readonly winCount: number,
        readonly winStreak: number,
        /*

         */
    ) {
    }
    toJson(): any {
        return { }
    }
    static FromJson(mode: GameModeType, jsonObject: any): GameModeSeason {
        return new GameModeSeason(
            mode,
            jsonObject.rank_level as Rank ?? Rank.NONE, //todo test null state

            jsonObject.max_rating,
            jsonObject.max_rating_1m,
            jsonObject.max_rating_7d,

            jsonObject.games_count,
            jsonObject.wins_count,
            jsonObject.streak,
        )
    }
}
export class GameMode {
    constructor(
        readonly mode: GameModeType,
        readonly current: GameModeSeason,
        readonly seasons: GameModeSeason[],
    ) {
    }

    toJson(): any {
        return { }
    }
    static FromJson(mode: GameModeType, jsonObject: any): GameMode {
        const current = GameModeSeason.FromJson(mode, jsonObject);
        const seasons: GameModeSeason[] = [current]
        if (jsonObject.previous_seasons !== undefined && jsonObject.previous_seasons !== null && jsonObject.previous_seasons.length > 0) {
            for (let i = 0; i < jsonObject.previous_seasons.length; i++) {
                const seasonJson = jsonObject.previous_seasons[i];
                const season = GameModeSeason.FromJson(mode, seasonJson);
                seasons.push(season);
            }
        }
        return new GameMode(
            mode,
            current,
            seasons,
        )
    }
}

export class SimplifiedGameModeSeason {
    constructor(
        readonly mode: GameModeType,
        readonly rank: Rank,
        readonly maxRating: number,
        readonly gameCount: number,
        readonly winCount: number,
        readonly winStreak: number,
        /*

         */
    ) {
    }
    toJson(): any {
        return { }
    }
    static FromJson(mode: GameModeType, jsonObject: any): SimplifiedGameModeSeason {
        return new SimplifiedGameModeSeason(
            mode,
            jsonObject.rank_level as Rank ?? Rank.NONE, //todo test null state

            jsonObject.rating ?? 0,

            jsonObject.games_count,
            jsonObject.wins_count,
            jsonObject.streak,
        )
    }
}
export class SimplifiedGameMode {
    constructor(
        readonly mode: GameModeType,
        readonly current: SimplifiedGameModeSeason,
        readonly seasons: SimplifiedGameModeSeason[],
    ) {
    }

    toJson(): any {
        return { }
    }
    static FromJson(mode: GameModeType, jsonObject: any): SimplifiedGameMode {
        const current = SimplifiedGameModeSeason.FromJson(mode, jsonObject);
        const seasons: SimplifiedGameModeSeason[] = [current]
        if (jsonObject.previous_seasons !== undefined && jsonObject.previous_seasons !== null && jsonObject.previous_seasons.length > 0) {
            for (let i = 0; i < jsonObject.previous_seasons.length; i++) {
                const seasonJson = jsonObject.previous_seasons[i];
                const season = SimplifiedGameModeSeason.FromJson(mode, seasonJson);
                seasons.push(season);
            }
        }
        return new SimplifiedGameMode(
            mode,
            current,
            seasons,
        )
    }
}

export class User implements ICacheable<number>{
    public static MIN_USERNAME_LENGTH = 3;
    public static NULL_AOE4WORLD_ID = -1;
    public static NULL_STEAM_ID = "-1";
    public static readonly NULL_USER = new User(
        User.NULL_AOE4WORLD_ID,
        User.NULL_STEAM_ID,
        "NULL",
        "",
        "",
        "",
        null,
        null,
    )

    get cacheKey(): number {
        return this.aoe4WorldId;
    }
    constructor(
        readonly aoe4WorldId: number,
        readonly steamId: string|null,
        readonly username: string,
        readonly fullAvatarImageUrl: string,
        readonly mediumAvatarImageUrl: string,
        readonly smallAvatarImageUrl: string,
        readonly modes: Map<GameModeType, GameMode>| null,
        readonly simplifiedModes: Map<GameModeType, SimplifiedGameMode>| null,
    ) { }

    isNull(): boolean {
        return this.aoe4WorldId == User.NULL_AOE4WORLD_ID;
    }

    //TODO figure out a good JSON deserialization library
    toJson(): any {
        return {
            profile_id: this.aoe4WorldId,
            steam_id: this.steamId,
            name: this.username,
            avatars: {
                full: this.fullAvatarImageUrl,
                medium: this.mediumAvatarImageUrl,
                small: this.smallAvatarImageUrl,
            }
        }
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
    static FromJson(jsonObject: any): User {
        let modes: Map<GameModeType, GameMode>| null = null;
        let simplifiedModes: Map<GameModeType, SimplifiedGameMode>| null = null;
        if (jsonObject.mode !== undefined && jsonObject.mode !== null) {
            modes = new Map<GameModeType, GameMode>();
            for (const key in jsonObject.mode) {
                const mode = key as GameModeType ?? GameModeType.NONE;
                if (mode == GameModeType.NONE) {
                    continue;
                }
                modes.set(mode, GameMode.FromJson(mode, jsonObject.mode[mode]));
            }
        } else if (jsonObject.leaderboards !== undefined && jsonObject.leaderboards !== null) {
            simplifiedModes = new Map<GameModeType, SimplifiedGameMode>();
            for (const key in jsonObject.leaderboards) {
                const mode = key as GameModeType ?? GameModeType.NONE;
                if (mode == GameModeType.NONE) {
                    continue;
                }
                simplifiedModes.set(mode, SimplifiedGameMode.FromJson(mode, jsonObject.leaderboards[mode]));
            }
        }
        return new User(
            jsonObject.profile_id,
            jsonObject.steam_id,
            jsonObject.name,
            jsonObject.avatars.full,
            jsonObject.avatars.medium,
            jsonObject.avatars.small,
            modes,
            simplifiedModes,
        )
    }
}
