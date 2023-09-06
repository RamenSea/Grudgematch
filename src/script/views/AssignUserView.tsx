import {BaseRootView} from "./BaseRootView";
import React from "react";
import {User} from "../models/User";
import {Button, Text, View} from "react-native";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";
import {UserCard} from "../components/UserCard";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";

export type AssignUserViewProps = {
    exactUser: User| null;
    username: string;
    query: AOE4WorldUserQuery|null;
}
class AssignUserViewState {
}
export class AssignUserView extends BaseRootView<"AssignUserView", AssignUserViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;

    exactUserResponse(isCorrect: boolean) {
        if (isCorrect == false) {
            this.props.navigation.pop();
            return;
        }
        const user = this.props.route.params.exactUser;
        if (user === null) {
            console.error("Setting the exact users while its null")
            return;
        }

        this.userService.setUser(user);
        this.props.navigation.reset({index: 0, routes: [{name: "UserOverviewView"}]});
    }
    renderView(): React.JSX.Element {
        if (this.props.route.params.exactUser != null) {

            return (
                <View>
                    <Text>
                        Is this the correct account?
                    </Text>
                    <UserCard
                        user={this.props.route.params.exactUser}
                        onClick={null}
                    />
                    <Button
                        title={"That's the one!"}
                        onPress={event => this.exactUserResponse(true)}
                    />
                    <Button
                        title={"Nope"}
                        onPress={event => this.exactUserResponse(false)}
                    />
                </View>
            );
        }


        return (
            <View/>
        );
    }


}