import {User} from "./User";
import {Game} from "./Game";


export class MatchUp {

    private _wins: number = -1;
    constructor(
        readonly user: User,
        readonly opponent: User,
        readonly games: Game[],
        readonly didReachLimitOnGames: boolean,
        ) {
    }


    get wins(): number {
        if (this._wins >= 0) {
            return this._wins;
        }

        let wins = 0
        this.games.forEach((value, index) => {
            const myPlayer = value.getPlayerById(this.user.aoe4WorldId);
            if (myPlayer != null && value.winningTeam == myPlayer.teamId) {
                wins++;
            }
        })
        this._wins = wins;
        return wins;
    }
}