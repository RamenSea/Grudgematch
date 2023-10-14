import { AppRegistry } from "react-native";
import { default as appJson} from './app.json';
import { default as App } from "./App";
import '@tamagui/core/reset.css'


AppRegistry.registerComponent(appJson.name, () => App);

AppRegistry.runApplication(appJson.name, {
    rootTag: document.getElementById("app-root"),
});