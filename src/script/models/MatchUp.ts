import {User} from "./User";
import {Game} from "./Game";
import {AOE4GameQuery} from "../queries/aoe4games/AOE4GameQuery";


export class MatchUp {

    private gameCountForWins: number = -1;
    private _wins: number = -1;
    private _completedGameCount: number = -1;
    constructor(
        readonly user: User,
        readonly opponent: User,
        readonly query: AOE4GameQuery,
        ) {
    }

    get games(): Game[] {
        return this.query.games;
    }

    get totalCompletedGames(): number {
        this.calculateValues();
        return this._completedGameCount;
    }
    get wins(): number {
        this.calculateValues();
        return this._wins;
    }
    private calculateValues() {
        if (this.gameCountForWins != this.games.length) {
            this._wins = -1;
            this.gameCountForWins = this.games.length;
        }
        if (this._wins >= 0) {
            return;
        }

        let wins = 0
        let gameCount = 0
        this.games.forEach((value, index) => {
            const myPlayer = value.getPlayerById(this.user.aoe4WorldId);
            if (value.isPlaying == false && myPlayer != null) {
                if (value.winningTeam == myPlayer.teamId) {
                    wins++;
                }
                gameCount++;
            }
        })
        this._wins = wins;
        this._completedGameCount = gameCount;
    }
}