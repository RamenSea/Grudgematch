import "reflect-metadata";

import React from 'react';
import {StartUpService} from "./script/services/StartUpService";
import {SERVICE_TYPES} from "./script/services/ServiceTypes";
import {container} from "./inversify.config";
import {RootRoute} from "./script/views/RootRoute";
import {Provider} from "inversify-react";
import {ActivityIndicator} from "react-native";

const startUpService = container.get<StartUpService>(SERVICE_TYPES.StartUpService);
startUpService.boot();


//   // const isDarkMode = useColorScheme() === 'dark';
//   //
//   // const backgroundStyle = {
//   //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   // };
//     //
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

        // if (this.userService.user.isNull()) {
        //     this.props.navigation.replace("SetUpView");
        // } else {
        //     this.props.navigation.replace("UserOverviewView", {selectedUser: null});
        // }
        return (
          <Provider container={container}>
              <RootRoute
                initialRouteName={"SetUpView"}
              />
          </Provider>
        );
    }
}
export default App;
