import {inject, injectable} from "inversify";
import {SERVICE_TYPES} from "./ServiceTypes";
import {UserService} from "./UserService";
import {KeyStoreService} from "./KeyStoreService";
import {AnalyticsService} from "./AnalyticsService";


export const CURRENT_COMPATABILITY_VERSION: number = 1;
export const FIRST_BOOT_COMPATABILITY_VERSION: number = -1;

@injectable()
export class StartUpService  {

    readonly bootPromise:Promise<void>
    private resolver: ((value?: void | PromiseLike<void>) => void)|null = null;
    private _booted: boolean = false;
    private _lastCompatibilityVersion: number = FIRST_BOOT_COMPATABILITY_VERSION;
    private hasStartedBooting = false;

    public userService: UserService;
    public keystoreService: KeyStoreService;
    public analyticsService: AnalyticsService;

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
        @inject(SERVICE_TYPES.KeyStoreService) keystoreService: KeyStoreService,
        @inject(SERVICE_TYPES.AnalyticsService) analyticsService: AnalyticsService,
    ) {
        this.userService = userService;
        this.keystoreService = keystoreService;
        this.analyticsService = analyticsService;
        this.bootPromise = new Promise<void>((resolve, reject) => {
            this.resolver = resolve;
        });
    }

    async boot() {
        if (this.hasStartedBooting) {
            return;
        }
        this.hasStartedBooting = true;
        const lcv = this.keystoreService.getNumber("last_compat_ver");
        if (lcv) {
            this._lastCompatibilityVersion = lcv;
        }

        this.analyticsService.setUp();
        const bootPromise = [
            this.userService.boot(),
        ]
        await Promise.all(bootPromise);

        this.keystoreService.set("last_compat_ver", CURRENT_COMPATABILITY_VERSION);

        this._booted = false;
        if (this.resolver) {
            this.resolver()
            this.resolver = null;
        }
    }


}