import {BaseRootView} from "./BaseRootView";
import React from "react";
import {User} from "../models/User";
import {Button, Text, View} from "react-native";
import {UserCard} from "../components/user/UserCard";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";

export type AssignUserViewProps = {
    user: User;
}
class AssignUserViewState {
}
export class AssignUserView extends BaseRootView<"AssignUserView", AssignUserViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;

    didSelectNotToAssign() {
        this.props.navigation.pop();
    }
    didSelectAssignUser() {
        const user = this.props.route.params.user;
        this.userService.setUser(user);
        this.props.navigation.reset({index: 0, routes: [{name: "UserOverviewView"}]});
    }
    renderView(): React.JSX.Element {
        return (
            <View>
                <Text>
                    Is this the correct account?
                </Text>
                <UserCard
                    user={this.props.route.params.user}
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