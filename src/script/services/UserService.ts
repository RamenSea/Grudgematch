import {inject, injectable} from "inversify";
import {User} from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SERVICE_TYPES} from "./ServiceTypes";
import {Aoe4WorldApiService} from "./Aoe4WorldApiService";
import {Subject} from "@reactivex/rxjs/dist/package";


@injectable()
export class UserService {

    private _user = User.NULL_USER;
    get user() { return this._user };

    public onUserUpdate: Subject<User>;

    private gameApiService: Aoe4WorldApiService;

    constructor(
        @inject(SERVICE_TYPES.GameApiService) gameApiService: Aoe4WorldApiService,
    ) {
        this.gameApiService = gameApiService;
        this.onUserUpdate = new Subject<User>();

    }
    async setUser(user: User) {
        this._user = user;
        await AsyncStorage.setItem("user", JSON.stringify(user.toJson()));
    }
    async boot() {
        const userString = await AsyncStorage.getItem("user");

        if (userString != null) {
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
            } catch (e) { }
        }


    }
}