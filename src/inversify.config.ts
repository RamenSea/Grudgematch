

import {Container} from "inversify";
import {UserService} from "./script/services/UserService";
import {SERVICE_TYPES} from "./script/services/ServiceTypes";
import {StartUpService} from "./script/services/StartUpService";
import {Aoe4WorldApiService} from "./script/services/Aoe4WorldApiService";
import {KeyStoreService} from "./script/services/KeyStoreService";
import {ToastService} from "./script/services/ToastService";
import {AnalyticsService} from "./script/services/AnalyticsService";



const container = new Container();


// Normal dependency graph here
container.bind<ToastService>(SERVICE_TYPES.ToastService).to(ToastService).inSingletonScope();
container.bind<KeyStoreService>(SERVICE_TYPES.KeyStoreService).to(KeyStoreService).inSingletonScope();
container.bind<Aoe4WorldApiService>(SERVICE_TYPES.GameApiService).to(Aoe4WorldApiService).inSingletonScope();
container.bind<UserService>(SERVICE_TYPES.UserService).to(UserService).inSingletonScope();
container.bind<AnalyticsService>(SERVICE_TYPES.AnalyticsService).to(AnalyticsService).inSingletonScope();
container.bind<StartUpService>(SERVICE_TYPES.StartUpService).to(StartUpService).inSingletonScope();



export { container }
