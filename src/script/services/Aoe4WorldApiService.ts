import {Game, GameSerializer} from "../models/Game";
import {User, UserSerializer} from "../models/User";
import {injectable} from "inversify";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";
import {IFetchCachedObject, MemoryCacheStorage, SimpleCache} from "../caches/SimpleCache";
import {MatchUp} from "../models/MatchUp";
import {AOE4GameQuery} from "../queries/aoe4games/AOE4GameQuery";

//todo figure out a good error system

@injectable()
export class Aoe4WorldApiService implements IFetchCachedObject<User, number> {

    userCache: SimpleCache<User, number>;

    constructor() {
        this.userCache = new SimpleCache<User, number>(
            new MemoryCacheStorage<User, number>(),
            this,
        )
    }

    getApiUrl(): string {
        return "https://aoe4world.com/api/v0/"
    }
    async getMatchUps(playerId: number, opponentIds: number[]): Promise<MatchUp[]> {
        try {
            const matchUpPromises: Promise<MatchUp|null>[] = [];
            for (let i = 0; i < opponentIds.length; i++) {
                matchUpPromises.push(this.getMatchUp(playerId, opponentIds[i]));
            }
            const matchUps: MatchUp[] = []
            const results = await Promise.all(matchUpPromises);
            for (let i = 0; i < results.length; i++) {
                const m = results[i];
                if (m !== null) {
                    matchUps.push(m);
                }
            }

            return matchUps;
        } catch (e) {
            console.error(e);
            return [];
        }
    }
    async getMatchUp(playerId: number, opponentId: number): Promise<MatchUp|null> {
        try {
            const userRequest = this.getUsersById(playerId);
            const opponentUserRequest = this.getUsersById(opponentId);
            const query = new AOE4GameQuery(
                AOE4GameQuery.CreateMatchUpQuery(playerId, opponentId),
                this
            );
            const user = await userRequest;
            const opponent = await opponentUserRequest;
            if (opponent == null || user == null) {
                return null;
            }
            await query.next();
            return new MatchUp(user, opponent, query);
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    getGameQuery(query: string, startingGames: Game[]|undefined = undefined): AOE4GameQuery {
        return new AOE4GameQuery(
            query,
            this,
            startingGames
        );
    }
    async getGame(playerId: number, gameId: number): Promise<Game|null> {
        try {
            let apiUrl = `${this.getApiUrl()}players/${playerId}/games/123633726/summary`;
            const results = await fetch(apiUrl);
            const responseJson = await results.json();
            return GameSerializer.parse(responseJson) ?? null;
        } catch (e) {
            console.error(e);
            return null;
        }

    }
    async getGames(playerId: number, opponentId: number = -1, limit: number = -1, page: number = -1): Promise<Array<Game>> {
        try {
            let apiUrl = `${this.getApiUrl()}players/${playerId}/games`;
            let queryParams: URLSearchParams| null = null;
            if (limit > 0) {
                queryParams = new URLSearchParams();
                queryParams.append("limit", limit.toString());
            }
            if (opponentId > 0) {
                if (queryParams === null) {
                    queryParams = new URLSearchParams();
                }
                queryParams.append("opponent_profile_id", opponentId.toString());
            }
            if (page > 0) {
                if (queryParams === null) {
                    queryParams = new URLSearchParams();
                }
                queryParams.append("page", page.toString());
            }
            if (queryParams !== null) {
                apiUrl += `?${queryParams.toString()}`;
            }

            const results = await fetch(apiUrl);
            const responseJson = await results.json();

            return GameSerializer.parseAsArray(responseJson.games);
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    getUserQuery(username: string, startingUsers: User[]|undefined = undefined, isFuzzy: boolean = false,): AOE4WorldUserQuery {
        return new AOE4WorldUserQuery(
            username,
            this,
            startingUsers,
            isFuzzy,
        );
    }
    async getSingleUserByUsername(username: string): Promise<User|null> {
        const exactMatches = await this.getUsersByUsername(username, true);
        if (exactMatches != null && exactMatches.length > 0) {
            return exactMatches[0];
        }

        const nearestMatch = await this.getUsersByUsername(username, false);
        if (nearestMatch != null && nearestMatch.length > 0) {
            return nearestMatch[0];
        }

        return null;
    }
    async getUsersByUsername(username: string, exact: boolean = false, fuzzy: boolean = false, page: number| null = null): Promise<Array<User>> { //limit is hard coded to be 50
        try {
            const searchParams = new URLSearchParams();
            searchParams.append("query", username);
            if (exact) {
                searchParams.append("exact", "true");
            }
            if (page && page > 1) { // indexing starts at 1
                searchParams.append("page", page.toString());
            }

            const searchType = fuzzy ? "search" : "search"
            const apiUrl = `https://aoe4world.com/api/v0/players/${searchType}?${searchParams.toString()}`;
            const results = await fetch(apiUrl);
            if (results.status == 500) {
                return []; // it looks like if you over page the results with the server it throws a 500
            }
            const responseJson = await results.json();
            const users = [];
            for (let i = 0; i < responseJson.players.length; i++) {
                const playerJson = responseJson.players[i];
                const user = UserSerializer.parse(playerJson);
                if (!user) {
                    throw new Error("couldn't parse user");
                }
                users.push(user);
            }
            return users;
        } catch (e) {
            console.error(e);
            return [];
        }
    }
    // Never check the cache with this method
    async getCacheableObject(key: number): Promise<User | null> {
        try {
            const apiUrl = `https://aoe4world.com/api/v0/players/${key}`;
            const results = await fetch(apiUrl);
            if (results.status == 404) {
                return null;
            }
            const responseJson = await results.json();
            return UserSerializer.parse(responseJson) ?? null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    async getUsersById(userId: number): Promise<User|null> {
        return this.userCache.get(userId);
    }
}
