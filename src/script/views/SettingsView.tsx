import {BaseView} from "./BaseView";
import React from "react";
import {MainAppViewProps} from "./RootRoute";
import {Button} from "../components/scaffolding/Button";

class SettingsViewState {
}
export class SettingsView extends BaseView<MainAppViewProps<"SettingsView">, SettingsViewState> {

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