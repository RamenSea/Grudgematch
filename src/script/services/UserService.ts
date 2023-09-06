import {inject, injectable} from "inversify";
import {User} from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SERVICE_TYPES} from "./ServiceTypes";
import {Aoe4WorldApiService} from "./Aoe4WorldApiService";


@injectable()
export class UserService {

    private _user = User.NULL_USER;
    get user() { return this._user };

    private gameApiService: Aoe4WorldApiService;
    constructor(
        @inject(SERVICE_TYPES.GameApiService) gameApiService: Aoe4WorldApiService,
    ) {
        this.gameApiService = gameApiService;
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