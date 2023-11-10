import {User} from "./User";
import {Game} from "./Game";
import {AOE4GameQuery} from "../queries/aoe4games/AOE4GameQuery";


export class MatchUp {

    private gameCountForWins: number = -1;
    private _gamesWith: number = -1;
    private _gamesAgainst: number = -1;
    private _winsWith: number = -1;
    private _winsAgainst: number = -1;
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
    get gamesWith(): number {
        this.calculateValues();
        return this._gamesWith;
    }
    get gamesAgainst(): number {
        this.calculateValues();
        return this._gamesAgainst;
    }
    get winsWith(): number {
        this.calculateValues();
        return this._winsWith;
    }
    get winsAgainst(): number {
        this.calculateValues();
        return this._winsAgainst;
    }
    private calculateValues() {
        if (this.gameCountForWins != this.games.length) {
            this._winsAgainst = -1;
            this.gameCountForWins = this.games.length;
        }
        if (this._winsAgainst >= 0) {
            return;
        }

        let winsWith = 0;
        let winsAgainst = 0;
        let gamesWith = 0;
        let gamesAgainst = 0;
        let gameCount = 0;
        this.games.forEach((value, index) => {
            const myPlayer = value.getPlayerById(this.user.aoe4WorldId);
            const opponent = value.getPlayerById(this.opponent.aoe4WorldId);
            if (value.isPlaying == false && myPlayer != null && opponent != null) {
                const sameTeam = myPlayer.teamId == opponent.teamId
                if (sameTeam) {
                    gamesWith++;
                } else {
                    gamesAgainst++;
                }
                if (value.winningTeam == myPlayer.teamId) {
                    if (sameTeam) {
                        winsWith++;
                    } else {
                        winsAgainst++;
                    }
                }
                gameCount++;
            }
        })
        this._winsWith = winsWith;
        this._winsAgainst = winsAgainst;
        this._gamesWith = gamesWith;
        this._gamesAgainst = gamesAgainst;
        this._completedGameCount = gameCount;
    }
}