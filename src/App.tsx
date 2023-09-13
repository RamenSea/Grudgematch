
import "reflect-metadata";
import React from 'react';
import {StartUpService} from "./script/services/StartUpService";
import {SERVICE_TYPES} from "./script/services/ServiceTypes";
import {container} from "./inversify.config";
import {RootRoute} from "./script/views/RootRoute";
import {Provider} from "inversify-react";

const startUpService = container.get<StartUpService>(SERVICE_TYPES.StartUpService);
startUpService.boot();

function App(): JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  //
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
      <Provider container={container}>
          <RootRoute/>
      </Provider>
  );
}
export default App;
