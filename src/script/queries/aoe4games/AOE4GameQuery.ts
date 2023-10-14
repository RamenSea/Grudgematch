import {User} from "../../models/User";
import {Subject} from "@reactivex/rxjs/dist/package";
import {Aoe4WorldApiService} from "../../services/Aoe4WorldApiService";
import {Game} from "../../models/Game";
import {MatchUp} from "../../models/MatchUp";

export enum AOE4GameQueryTypes {
    MATCH_UP = "m",
    RECENT = "r",
}
export class AOE4GameQuery {

    public games: Game[];
    public onNextBatch: Subject<Game[]>;

    private parsedQuery: any;
    private parsedQueryType: AOE4GameQueryTypes;
    private isLoading = false;
    private isFinished = false;
    private currentPage = 1; // indexing starts at 1

    private currentPromise: Promise<void>|null = null;
    public readonly pageSize = 50; // This value is hardcoded on the server
    constructor(
        query: string,
        private aoe4WorldApiService: Aoe4WorldApiService,
        startingGames: Game[]|undefined = undefined,
    ) {
        this.parsedQuery = JSON.parse(query);
        this.parsedQueryType = this.parsedQuery.t as AOE4GameQueryTypes;
        this.games = [];
        this.onNextBatch = new Subject<Array<Game>>();
        if (startingGames && startingGames.length > 0) {
            this.games.push(...startingGames);
            this.currentPage++;
        }
    }
    async next() {
        if (this.isLoading || this.isFinished) {
            return this.currentPromise;
        }

        this.isLoading = true;
        let resolver!: (() => void);
        this.currentPromise = new Promise(_resolve => {
            resolver = _resolve;
        });

        let nextBatch: Game[];
        try {
            switch (this.parsedQueryType) {
                case AOE4GameQueryTypes.RECENT:
                    nextBatch = await this.aoe4WorldApiService.getGames(this.parsedQuery.pId, this.pageSize, this.currentPage);
                    break;
                case AOE4GameQueryTypes.MATCH_UP:
                    nextBatch = await this.aoe4WorldApiService.getGames(this.parsedQuery.pId, this.parsedQuery.oId, this.pageSize, this.currentPage);
                    break;
            }
        } catch (e) {
            // TODO error handling
            console.error(e);
            this.isFinished = true;
            this.onNextBatch.error(e)
            return;
        }

        this.isFinished = nextBatch.length < this.pageSize;

        this.games.push(...nextBatch);
        this.currentPage++;
        this.isLoading = false;
        this.onNextBatch.next(nextBatch);
        if (this.isFinished) {
            this.onNextBatch.complete();
        }
        resolver();
    }

    static CreateMatchUpQuery(matchUp: MatchUp): string {
        return `{"t":"${AOE4GameQueryTypes.MATCH_UP.toString()}", "pId": ${matchUp.user.aoe4WorldId}, "oId": ${matchUp.opponent.aoe4WorldId}}`;
    }
    static CreateRecentQuery(userId: number): string {
        return `{"t":"${AOE4GameQueryTypes.RECENT.toString()}", "pId": ${userId}}`;
    }
}