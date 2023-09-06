import {BaseRootView} from "./BaseRootView";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {MainAppViewProps} from "./RootRoute";
import React from "react";
import {View} from "react-native";
import {User} from "../models/User";

export type UserOverviewViewProps = {
    selectedUser: User|null;
}
class UserOverviewViewState {
    username: string = "";
    isLoading: boolean = false;
}
export class UserOverviewView extends BaseRootView<"UserOverviewView", UserOverviewViewState> {

    @resolve(SERVICE_TYPES.GameApiService)
    private readonly aoe4WorldApiService!: Aoe4WorldApiService;

    constructor(props: MainAppViewProps<"UserOverviewView">) {
        super(props);
        this.state = new UserOverviewViewState();
    }

    renderView(): React.JSX.Element {
        return (
            <View></View>
        );
    }

}