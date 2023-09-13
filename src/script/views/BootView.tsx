import {BaseRootView} from "./BaseRootView";
import React from "react";
import {View} from "react-native";
import {resolve} from "inversify-react";
import {StartUpService} from "../services/StartUpService";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";

class BootViewState {
}
export class BootView extends BaseRootView<"BootView", BootViewState> {

    @resolve(SERVICE_TYPES.StartUpService)
    private readonly startUpService!: StartUpService;
    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;

    onWillAppear() {
        super.onWillAppear();
        this.bootOperation();
    }

    async bootOperation() {
        await this.startUpService.bootPromise;

        if (this.userService.user.isNull()) {
            this.props.navigation.replace("SetUpView");
        } else {
            this.props.navigation.replace("UserOverviewView", {selectedUser: null});
        }
    }
    renderView(): React.JSX.Element {
        return (
            <View/>
        );
    }
}