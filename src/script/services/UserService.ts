import {inject, injectable} from "inversify";
import {User} from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SERVICE_TYPES} from "./ServiceTypes";
import {Aoe4WorldApiService} from "./Aoe4WorldApiService";
import {CacheableKeys, IFetchCachedObject, MemoryCacheStorage, SimpleCache} from "../caches/SimpleCache";


class FetchUserForCache implements IFetchCachedObject<User, number> {
    constructor(private gameApiService: Aoe4WorldApiService) {
    }
    get(key: number): Promise<User | null> {
        return this.gameApiService.getUsersById(key);
    }
}
@injectable()
export class UserService {

    private _user = User.NULL_USER;
    get user() { return this._user };

    private gameApiService: Aoe4WorldApiService;
    private userCache: SimpleCache<User, number>;

    constructor(
        @inject(SERVICE_TYPES.GameApiService) gameApiService: Aoe4WorldApiService,
    ) {
        this.gameApiService = gameApiService;

        this.userCache = new SimpleCache<User, number>(
            new MemoryCacheStorage<User, number>(),
            new FetchUserForCache(gameApiService),
        )
    }
    async getUserById(id: number): Promise<User| null> {
        return this.userCache.get(id);
    }
    async setUser(user: User) {
        this._user = user;
        await this.userCache.set(user);
        await AsyncStorage.setItem("user", JSON.stringify(user.toJson()));
    }
    async boot() {
        const userString = await AsyncStorage.getItem("user");

        if (userString != null) {
            try {
                const userJson = JSON.parse(userString);
                const parsedUser = User.FromJson(userJson);
                this._user = parsedUser;
            } catch (e) { }
        }


    }
}