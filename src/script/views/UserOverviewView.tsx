import {BaseRootView} from "./BaseRootView";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {MainAppViewProps} from "./RootRoute";
import React from "react";
import {Button, Text, View} from "react-native";
import {User} from "../models/User";
import {UserService} from "../services/UserService";
import {UserCard} from "../components/user/UserCard";

export type UserOverviewViewProps = {
    selectedUser: User|null;
}
class UserOverviewViewState {
    constructor(
        public user: User|null,

        public getCurrentGameButtonActive: boolean = true,
        public listenForNewGameButtonActive: boolean = true,
    ) { }
}
export class UserOverviewView extends BaseRootView<"UserOverviewView", UserOverviewViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;

    @resolve(SERVICE_TYPES.GameApiService)
    private readonly aoe4WorldApiService!: Aoe4WorldApiService;

    constructor(props: MainAppViewProps<"UserOverviewView">, context: {}) {
        super(props, context);
        if (this.props.route.params.selectedUser != null) {
            this.state = new UserOverviewViewState(this.props.route.params.selectedUser);
        } else if (this.userService.user != null) {
            this.state = new UserOverviewViewState(this.userService.user);
        } else {
            throw new Error("You opened `UserOverviewView` without a user set in UserService or a user specified");
        }
    }

    private async didPressCheckCurrentGame() {

    }
    renderView(): React.JSX.Element {
        if (this.state.user === null) {
            return (
                <View>
                    <Text>
                        LOADING
                    </Text>
                </View>
            )
        }
        return (
            <View>
                <Text>
                    User:
                </Text>
                <UserCard
                    user={this.state.user}
                    onClick={null}
                />
                <Button
                    title={"Check current game"}
                    onPress={event => this.didPressCheckCurrentGame()}
                />
                <Button
                    title={"Listen for upcoming game"}
                />
            </View>
        );
    }

}