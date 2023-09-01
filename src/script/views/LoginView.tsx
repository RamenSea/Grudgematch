import {BaseRootView} from "./BaseRootView";
import React from "react";
import {View} from "react-native";
import {JsonSerializer} from "typescript-json-serializer";
import {Game} from "../models/Game";


class LoginViewState {

}
export class LoginView extends BaseRootView<"LoginView", LoginViewState> {
    renderView(): React.JSX.Element {

        return (<View/>);
    }
}