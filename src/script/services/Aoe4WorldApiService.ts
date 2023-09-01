import {Game} from "../models/Game";
import {User} from "../models/User";

//todo figure out a good error system

export class Aoe4WorldApiService {

    getApiUrl(): string {
        return "https://aoe4world.com/api/v0/"
    }

    async getGames(playerId: number, opponentId: number = -1, limit: number = -1): Promise<Array<Game>> {
        let apiUrl = `${this.getApiUrl()}${playerId}/games`;
        let queryParams: URLSearchParams| null = null;
        if (limit > 0) {
            queryParams = new URLSearchParams();
            queryParams.set("limit", limit.toString());
        }
        if (opponentId > 0) {
            if (queryParams === null) {
                queryParams = new URLSearchParams();
            }
            queryParams.set("opponent_profile_id", opponentId.toString());
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

    async getUsersByUsername(username: string, exact: boolean = false, limit: number| null = null): Promise<Array<User>> {
        let apiUrl = `https://aoe4world.com/api/v0/players/search?query=${username}`;
        if (exact) {
            apiUrl += `&exact=true`;
        }
        if (limit && limit > 0) {
            apiUrl += `&limit=${limit}`;
        }
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
