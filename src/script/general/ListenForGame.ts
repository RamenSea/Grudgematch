import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {User} from "../models/User";
import {Game} from "../models/Game";


export class ListenForGame {
    maxAttempts: number = 10; // tries ten times
    checkIntervalMS: number = 2000
    gameService: Aoe4WorldApiService
    user: User

    foundGame: Game|null = null;
    failedToFindGame: boolean = false;

    private isRunning: boolean = false;
    private onFoundGame: (game: Game|null) => void;
    private attempts: number = 0;
    private timeOutId: NodeJS.Timeout|null = null;

    constructor(gameService: Aoe4WorldApiService, user: User, onFoundGame: (game: (Game | null)) => void) {
        this.gameService = gameService;
        this.user = user;
        this.onFoundGame = onFoundGame;
    }

    public start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.attempts = 0;
        this.failedToFindGame = false;
        this.foundGame = null;
        this.checkGame();
    }
    public cancel() {
        this.cancelTimeout();
        this.isRunning = false;
    }

    private async checkGame() {
        this.cancelTimeout();
        const games = await this.gameService.getGames(this.user.aoe4WorldId, -1, 1);
        if (games.length == 0) {
            this.scheduleNextCheck();
            return;
        }
        const game = games[0];
        if (game.isPlaying == false) {
            this.scheduleNextCheck();
            return;
        }
        this.failedToFindGame = false;
        this.foundGame = game;
        this.onFoundGame(game);
    }

    private scheduleNextCheck() {
        this.cancelTimeout();
        this.attempts++;
        if (this.attempts > this.maxAttempts) {
            this.failedToFindGame = true;
            this.onFoundGame(null);
            return;
        }
        this.timeOutId = setTimeout(args => this.checkGame(), this.checkIntervalMS);
    }
    private cancelTimeout() {
        if (this.timeOutId) {
            clearTimeout(this.timeOutId);
            this.timeOutId = null;
        }
    }
}