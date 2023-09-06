import {Aoe4WorldApiService} from "../../services/Aoe4WorldApiService";
import {Observable, Subject, Subscriber} from "@reactivex/rxjs/dist/package";
import {User} from "../../models/User";


export class AOE4WorldUserQuery {

    public users: User[];
    public onNextBatch: Subject<User[]>;

    private isLoading = false;
    private isFinished = false;
    private currentPage = 0;

    constructor(
        public username: string,
        private aoe4WorldApiService: Aoe4WorldApiService,
        public pageSize: number = 10,
    ) {

        this.users = [];
        this.onNextBatch = new Subject<Array<User>>();
    }


    async next() {
        if (this.isLoading || this.isFinished) {
            return;
        }
        this.isLoading = true;

        let nextBatch: User[];
        try {
            nextBatch = await this.aoe4WorldApiService.getUsersByUsername(this.username, false, this.pageSize, this.currentPage);
        } catch (e) {
            // TODO error handling
            console.error(e);
            this.isFinished = true;
            this.onNextBatch.error(e)
            return;
        }

        this.users.push(...nextBatch);
        this.isFinished = nextBatch.length < this.pageSize;
        this.currentPage++;
        this.isLoading = false;
        this.onNextBatch.next(nextBatch);
        if (this.isFinished) {
            this.onNextBatch.complete();
        }
    }
}