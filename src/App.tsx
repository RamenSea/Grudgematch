import "reflect-metadata";

import React from 'react';
import {StartUpService} from "./script/services/StartUpService";
import {SERVICE_TYPES} from "./script/services/ServiceTypes";
import {container} from "./inversify.config";
import {RootRoute, RootRouteProps} from "./script/views/RootRoute";
import {ActivityIndicator} from "react-native";
import {UserService} from "./script/services/UserService";
import {AppScaffolding} from "./script/components/scaffolding/AppScaffolding";

const startUpService = container.get<StartUpService>(SERVICE_TYPES.StartUpService);
const userService = container.get<UserService>(SERVICE_TYPES.UserService);

startUpService.boot();

type AppProps = {};
class AppState {
    constructor(
        public hasBooted: boolean
    ) {
    }
}
class App extends React.Component<AppProps, AppState> {

    private isListeningForBoot = false;

    constructor(props: Readonly<AppProps> | AppProps) {
        super(props);
        this.state = new AppState(false);
    }

    componentDidMount() {
        this.listenForBoot();
    }

    private async listenForBoot() {
        if (this.isListeningForBoot) {
            return;
        }
        this.isListeningForBoot = true;
        await startUpService.bootPromise;
        this.setState({hasBooted: true})
    }
    render() {
        if (this.state.hasBooted == false) {
            return (
                <ActivityIndicator></ActivityIndicator>
            );
        }


        let initialRouteName: keyof RootRouteProps = "SetUpView";
        if (!userService.user.isNull()) {
            initialRouteName = "UserOverviewView";
        }

        return (
            <AppScaffolding>
                <RootRoute
                    initialRouteName={initialRouteName}
                />
            </AppScaffolding>
        );
    }
}
export default App;
