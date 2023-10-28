import {BaseView} from "./BaseView";
import React from "react";
import {MainAppViewProps} from "./RootRoute";
import {Button} from "../components/scaffolding/Button";
import {ListItem, YStack} from "tamagui";
import {ChevronRight, UserCircle} from "@tamagui/lucide-icons";
import {WebHeader} from "../components/scaffolding/WebHeader";

class SettingsViewState {
}
export class SettingsView extends BaseView<MainAppViewProps<"SettingsView">, SettingsViewState> {

    didPressSetUser() {
        this.props.navigation.reset({index: 0, routes: [{name: "SetUpView"}]});
    }
    renderView(): React.JSX.Element {
        return (
            <YStack
                flex={1}
            >
                <WebHeader
                    title={"Settings"}
                />
                <ListItem
                    hoverTheme
                    onPress={event => this.didPressSetUser()}
                    icon={UserCircle}
                    iconAfter={ChevronRight}
                >
                    <ListItem.Text
                        fontSize={18}
                    >
                        Set user
                    </ListItem.Text>
                </ListItem>
            </YStack>
        );
    }


}