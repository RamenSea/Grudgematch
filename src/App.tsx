import "reflect-metadata";

import React, {ReactNode} from 'react';
import {StartUpService} from "./script/services/StartUpService";
import {SERVICE_TYPES} from "./script/services/ServiceTypes";
import {container} from "./inversify.config";
import {RootRoute} from "./script/views/RootRoute";
import {AppScaffolding} from "./script/components/scaffolding/AppScaffolding";
import {LoadingCover} from "./script/components/scaffolding/LoadingCover";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ToastService} from "./script/services/ToastService";

const startUpService = container.get<StartUpService>(SERVICE_TYPES.StartUpService);
const toastService = container.get<ToastService>(SERVICE_TYPES.ToastService);
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
            <SafeAreaProvider>
                <AppScaffolding
                    toastService={toastService}
                >
                    {inner}
                </AppScaffolding>
            </SafeAreaProvider>
        );
    }
}
export default App;
