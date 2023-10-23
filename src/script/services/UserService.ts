import {inject, injectable} from "inversify";
import {User} from "../models/User";
import {SERVICE_TYPES} from "./ServiceTypes";
import {Aoe4WorldApiService} from "./Aoe4WorldApiService";
import {Subject} from "@reactivex/rxjs/dist/package";
import {KeyStoreService} from "./KeyStoreService";


@injectable()
export class UserService {

    private _user = User.NULL_USER;
    get user() { return this._user };

    public onUserUpdate: Subject<User>;

    private gameApiService: Aoe4WorldApiService;
    private keystoreService: KeyStoreService;

    constructor(
        @inject(SERVICE_TYPES.GameApiService) gameApiService: Aoe4WorldApiService,
        @inject(SERVICE_TYPES.KeyStoreService) keystoreService: KeyStoreService,
    ) {
        this.gameApiService = gameApiService;
        this.keystoreService = keystoreService;
        this.onUserUpdate = new Subject<User>();

    }
    async setUser(user: User) {
        this._user = user;
        this.keystoreService.set("user", JSON.stringify(user.toJson()));
    }
    async boot() {
        const userString = this.keystoreService.getString("user");

        if (userString) {
            try {
                const userJson = JSON.parse(userString);
                const parsedUser = User.FromJson(userJson);
                this._user = parsedUser;
                if (this._user.isNull() == false) {
                    this.onUserUpdate.next(this._user);
                    this.gameApiService.getUsersById(this._user.aoe4WorldId).then((user) => {
                        //do not await this, this can auto update post boot
                        if (user === null) {
                            return;
                        }
                        this._user = user;
                        this.onUserUpdate.next(this._user);
                    });
                }
            } catch (e) {
                console.error(e)
            }
        }

    }
}