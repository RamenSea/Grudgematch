import {inject, injectable} from "inversify";
import {SERVICE_TYPES} from "./ServiceTypes";
import {UserService} from "./UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const CURRENT_COMPATABILITY_VERSION: number = 1;
export const FIRST_BOOT_COMPATABILITY_VERSION: number = -1;

@injectable()
export class StartUpService  {

    readonly bootPromise:Promise<void>
    private resolver: ((value?: void | PromiseLike<void>) => void)|null = null;
    private _booted: boolean = false;
    private _lastCompatibilityVersion: number = FIRST_BOOT_COMPATABILITY_VERSION;

    public userService: UserService;
    get booted(): boolean {
        return this._booted;
    }
    get isFirstBoot(): boolean {
        return this._lastCompatibilityVersion == FIRST_BOOT_COMPATABILITY_VERSION;
    }
    get lastCompatibilityVersion(): number {
        return this._lastCompatibilityVersion;
    }
    constructor(
        @inject(SERVICE_TYPES.UserService) userService: UserService,
    ) {
        this.userService = userService;
        this.bootPromise = new Promise<void>((resolve, reject) => {
            this.resolver = resolve;
        });
    }

    async boot() {
        const lcv = await AsyncStorage.getItem("last_compat_ver");
        if (lcv != null) {
            try {
                const parsedLCV = parseInt(lcv);
                if (isNaN(parsedLCV) == false) {
                    this._lastCompatibilityVersion = parsedLCV;
                }
            } catch (e) { }
        }

        const bootPromise = [
            this.userService.boot(),
        ]
        await Promise.all(bootPromise);

        await AsyncStorage.setItem("last_compat_ver", CURRENT_COMPATABILITY_VERSION.toString());

        this._booted = false;
        if (this.resolver) {
            this.resolver()
            this.resolver = null;
        }
    }


}