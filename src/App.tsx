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

        let inner: ReactNode;
        if (this.state.hasBooted == false) {
            inner = (
                <YStack
                    alignContent={"center"}
                    alignItems={"center"}
                    flex={1}
                    height={"100%"}
                >
                    <H4
                        marginTop={"auto"}
                        marginBottom={16}
                    >
                        Leading...
                    </H4>
                    <ThemedSpinner
                        size={"large"}
                        marginBottom={"auto"}
                    />
                </YStack>
            );
        } else {
            let initialRouteName: keyof RootRouteProps = "SetUpView";
            if (!userService.user.isNull()) {
                initialRouteName = "UserOverviewView";
            }
            inner = (
                <RootRoute
                    initialRouteName={initialRouteName}
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
