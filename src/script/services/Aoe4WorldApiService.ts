import {Game} from "../models/Game";
import {User} from "../models/User";
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
    }
    async getMatchUp(playerId: number, opponentId: number): Promise<MatchUp|null> {
        const userRequest = this.getUsersById(playerId);
        const opponentUserRequest = this.getUsersById(opponentId);
        const gamesRequest = this.getGames(playerId, opponentId);

        const user = await userRequest;
        const opponent = await opponentUserRequest;
        const games = await gamesRequest;

        if (opponent == null || user == null) {
            return null;
        }

        return new MatchUp(user, opponent, games);
    }
    getGameQuery(query: string, startingGames: Game[]|undefined = undefined): AOE4GameQuery {
        return new AOE4GameQuery(
            query,
            this,
            startingGames
        );
    }
    async getGames(playerId: number, opponentId: number = -1, limit: number = -1, page: number = -1): Promise<Array<Game>> {
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

        let games = [];
        for (let i = 0; i < responseJson.games.length; i++) {
            const gameJson = responseJson.games[i];
            const game = Game.FromJson(gameJson);
            games.push(game);
        }
        return games;
    }

    getUserQuery(username: string, startingUsers: User[]|undefined = undefined): AOE4WorldUserQuery {
        return new AOE4WorldUserQuery(
            username,
            this,
            startingUsers,
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
    async getUsersByUsername(username: string, exact: boolean = false, page: number| null = null): Promise<Array<User>> { //limit is hard coded to be 50
        const searchParams = new URLSearchParams();
        searchParams.append("query", username);
        if (exact) {
            searchParams.append("exact", "true");
        }
        if (page && page > 1) { // indexing starts at 1
            searchParams.append("page", page.toString());
        }

        const apiUrl = `https://aoe4world.com/api/v0/players/search?${searchParams.toString()}`;
        const results = await fetch(apiUrl);
        if (results.status == 500) {
            return []; // it looks like if you over page the results with the server it throws a 500
        }
        const responseJson = await results.json();
        const users = [];
        for (let i = 0; i < responseJson.players.length; i++) {
            const playerJson = responseJson.players[i];
            users.push(User.FromJson(playerJson));
        }
        return users;
    }
    // Never check the cache with this method
    async getCacheableObject(key: number): Promise<User | null> {
        const apiUrl = `https://aoe4world.com/api/v0/players/${key}`;
        const results = await fetch(apiUrl);
        if (results.status == 404) {
            return null;
        }
        const responseJson = await results.json();
        return User.FromJson(responseJson);
    }
    async getUsersById(userId: number): Promise<User|null> {
        return this.userCache.get(userId);
    }
}
