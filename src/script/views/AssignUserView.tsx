import {BaseRootView} from "./BaseRootView";
import React from "react";
import {User} from "../models/User";
import {Button, Text, View} from "react-native";
import {UserCard} from "../components/user/UserCard";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import { Button as StyleButton } from '@rneui/themed';


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
            <View
                style={{
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        marginTop: 32,
                        marginRight: 32,
                        marginLeft: 32,
                        marginBottom: 24,
                        textAlign: "center",
                        fontSize: 24,
                    }}
                >
                    Do you want to use this account?
                </Text>
                <UserCard
                    user={this.state.user}
                    onClick={null}
                />
                <View
                    style={{
                        flex: 1,
                    }}
                />
                <Button
                    title={"Wrong account"}
                    onPress={event => this.didSelectNotToAssign()}
                />
                <View
                    style={{
                        height: 8,
                    }}
                />
                <StyleButton
                    title="ASSIGN"
                    loadingProps={{ size: 'large', color: 'white' }}
                    buttonStyle={{
                        height: "100%",
                        backgroundColor: 'rgba(111, 202, 186, 1)',
                    }}
                    titleStyle={{ fontWeight: 'bold', fontSize: 32, letterSpacing: 16, }}
                    containerStyle={{
                        maxHeight: 160,
                        width: "100%",
                    }}
                    onPress={event => this.didSelectAssignUser()}
                />
            </View>
        );
    }


}