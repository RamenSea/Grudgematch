import {Aoe4WorldApiService} from "../../services/Aoe4WorldApiService";
import {Observable, Subject, Subscriber} from "@reactivex/rxjs/dist/package";
import {User} from "../../models/User";


export class AOE4WorldUserQuery {

    public users: User[];
    public onNextBatch: Subject<User[]>;

    private isLoading = false;
    private isFinished = false;
    private isFuzzy = false;
    private currentPage = 1; // indexing starts at 1

    private currentPromise: Promise<void>|null = null;
    public readonly pageSize = 50; // This value is hardcoded on the server
    constructor(
        public username: string,
        private aoe4WorldApiService: Aoe4WorldApiService,
        startingUsers: User[]|undefined = undefined,
        isFuzzy: boolean = false,
    ) {

        this.users = [];
        this.isFuzzy = isFuzzy;
        this.onNextBatch = new Subject<Array<User>>();
        if (startingUsers && startingUsers.length > 0) {
            this.users.push(...startingUsers);
            this.isFinished = startingUsers.length < this.pageSize;
            this.currentPage++;
        }
    }


    async next() {
        if (this.isLoading || this.isFinished) {
            return this.currentPromise;
        }
        console.error("asdf");

        this.isLoading = true;
        let resolver!: (() => void);
        this.currentPromise = new Promise(_resolve => {
            resolver = _resolve;
        });

        let nextBatch: User[];
        try {
            nextBatch = await this.aoe4WorldApiService.getUsersByUsername(this.username, false, this.isFuzzy, this.currentPage);
        } catch (e) {
            // TODO error handling
            console.error(e);
            this.isFinished = true;
            this.onNextBatch.error(e)
            return;
        }

        this.isFinished = nextBatch.length < this.pageSize;

        if (this.users.length > 0) {
            // Aoe4 world returns duplicate values across pages, just scrub them out until they fix this issue
            nextBatch = nextBatch.filter(value => {
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].aoe4WorldId === value.aoe4WorldId) {
                        return false;
                    }
                }
                return true;
            });
        }

        this.users.push(...nextBatch);
        this.currentPage++;
        this.isLoading = false;
        this.onNextBatch.next(nextBatch);
        if (this.isFinished) {
            this.onNextBatch.complete();
        }
        resolver();
    }
}