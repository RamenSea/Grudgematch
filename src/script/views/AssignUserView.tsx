import {BaseRootView} from "./BaseRootView";
import React from "react";
import {User} from "../models/User";
import {Button, Text, View} from "react-native";
import {UserCard} from "../components/user/UserCard";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import * as console from "console";

export type AssignUserViewProps = {
    user: User;
}
class AssignUserViewState {

    constructor(
        public user: User) {
    }
}
export class AssignUserView extends BaseRootView<"AssignUserView", AssignUserViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;


    constructor(props: MainAppViewProps<"AssignUserView">, context: {}) {
        super(props, context);

        this.state = new AssignUserViewState(props.route.params.user);
    }

    didSelectNotToAssign() {
        this.props.navigation.pop();
    }
    didSelectAssignUser() {
        void this.userService.setUser(this.state.user);
        this.props.navigation.reset({index: 0, routes: [{name: "UserOverviewView"}]});
    }
    renderView(): React.JSX.Element {
        return (
            <View>
                <Text>
                    Is this the correct account?
                </Text>
                <UserCard
                    user={this.state.user}
                    onClick={null}
                />
                <Button
                    title={"That's the one!"}
                    onPress={event => this.didSelectAssignUser()}
                />
                <Button
                    title={"Nope"}
                    onPress={event => this.didSelectNotToAssign()}
                />
            </View>
        );
    }


}