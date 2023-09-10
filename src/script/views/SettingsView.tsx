import {BaseRootView} from "./BaseRootView";
import React from "react";
import {Button} from "react-native";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";

class SettingsViewState {
}
export class SettingsView extends BaseRootView<"SettingsView", SettingsViewState> {

    didPressSetUser() {
        this.props.navigation.reset({index: 0, routes: [{name: "SetUpView"}]});
    }
    renderView(): React.JSX.Element {
        return (
            <Button
                onPress={event => this.didPressSetUser()}
                title={"Set user"}
            />
        );
    }


}