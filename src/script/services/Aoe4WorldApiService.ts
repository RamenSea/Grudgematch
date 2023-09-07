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

    getUserQuery(username: string, startingUsers: User[]|null = null): AOE4WorldUserQuery {
        return new AOE4WorldUserQuery(
            username,
            this,
            startingUsers,
        );
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
