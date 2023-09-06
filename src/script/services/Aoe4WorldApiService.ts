import {Game} from "../models/Game";
import {User} from "../models/User";
import {injectable} from "inversify";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";

//todo figure out a good error system

@injectable()
export class Aoe4WorldApiService {

    getApiUrl(): string {
        return "https://aoe4world.com/api/v0/"
    }

    async getGames(playerId: number, opponentId: number = -1, limit: number = -1): Promise<Array<Game>> {
        let apiUrl = `${this.getApiUrl()}${playerId}/games`;
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

    getUserQuery(username: string, limit: number = 10): AOE4WorldUserQuery {
        return new AOE4WorldUserQuery(
            username,
            this,
            limit,
        );
    }
    async getUsersByUsername(username: string, exact: boolean = false, limit: number| null = null, page: number| null = null): Promise<Array<User>> {
        const searchParams = new URLSearchParams();
        searchParams.append("query", username);
        if (exact) {
            searchParams.append("exact", "true");
        }
        if (limit && limit > 0) {
            searchParams.append("limit", limit.toString());
        }
        if (page && page > 0) {
            searchParams.append("page", page.toString());
        }

        const apiUrl = `https://aoe4world.com/api/v0/players/search?${searchParams.toString()}`;
        const results = await fetch(apiUrl);
        const responseJson = await results.json();
        const users = [];
        for (let i = 0; i < responseJson.players.length; i++) {
            const playerJson = responseJson.players[i];
            users.push(User.FromJson(playerJson));
        }
        return users;
    }
    async getUsersById(userId: number): Promise<User|null> {
        const apiUrl = `https://aoe4world.com/api/v0/players/${userId}`;
        const results = await fetch(apiUrl);
        if (results.status == 404) {
            return null;
        }
        const responseJson = await results.json();
        return User.FromJson(responseJson);
    }
}
