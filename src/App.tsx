import "reflect-metadata";

import React, {ReactNode} from 'react';
import {StartUpService} from "./script/services/StartUpService";
import {SERVICE_TYPES} from "./script/services/ServiceTypes";
import {container} from "./inversify.config";
import {RootRoute, RootRouteProps} from "./script/views/RootRoute";
import {UserService} from "./script/services/UserService";
import {AppScaffolding} from "./script/components/scaffolding/AppScaffolding";
import {H4, YStack} from "tamagui";
import {ThemedSpinner} from "./script/components/scaffolding/ThemedSpinner";
import {LoadingCover} from "./script/components/scaffolding/LoadingCover";

const startUpService = container.get<StartUpService>(SERVICE_TYPES.StartUpService);
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

        let inner: ReactNode;
        if (this.state.hasBooted == false) {
            inner = (
                <LoadingCover
                    height={"100%"}
                />
            );
        } else {
            inner = (
                <RootRoute
                />
            );
        }

        return (
            <AppScaffolding>
                {inner}
            </AppScaffolding>
        );
    }
}
export default App;
