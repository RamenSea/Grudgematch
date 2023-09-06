
import "reflect-metadata";
import React from 'react';
import {IStartUpService} from "./src/script/services/StartUpService";
import {SERVICE_TYPES} from "./src/script/services/ServiceTypes";
import {container} from "./inversify.config";
import {RootRoute} from "./src/script/views/RootRoute";
import {Provider} from "inversify-react";

const startUpService = container.get<IStartUpService>(SERVICE_TYPES.StartUpService);
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
