

import {Container} from "inversify";
import {UserService} from "./src/script/services/UserService";
import {SERVICE_TYPES} from "./src/script/services/ServiceTypes";
import {IStartUpService, StartUpService} from "./src/script/services/StartUpService";
import {Aoe4WorldApiService} from "./src/script/services/Aoe4WorldApiService";



const container = new Container();


// Normal dependency graph here
container.bind<Aoe4WorldApiService>(SERVICE_TYPES.GameApiService).to(Aoe4WorldApiService).inSingletonScope();
container.bind<UserService>(SERVICE_TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IStartUpService>(SERVICE_TYPES.StartUpService).to(StartUpService).inSingletonScope();



export { container }
