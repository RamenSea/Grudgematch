import {BaseRootView} from "./BaseRootView";
import React from "react";
import {User} from "../models/User";
import {ActivityIndicator, Button, Text, View} from "react-native";
import {UserCard} from "../components/user/UserCard";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import { Button as StyleButton } from '@rneui/themed';
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";


export type AssignUserViewProps = {
    username?: string,
    userId?: number,
}
class AssignUserViewState {
    constructor(
        public user?: User) {
    }
}
export class AssignUserView extends BaseRootView<"AssignUserView", AssignUserViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;
    @resolve(SERVICE_TYPES.GameApiService)
    private readonly gameApiService!: Aoe4WorldApiService;

    constructor(props: MainAppViewProps<"AssignUserView">, context: {}) {
        super(props, context);

        this.state = new AssignUserViewState(undefined);
        this.fetchUser();
    }

    protected webMaxHeight(windowHeight: number): number {
        if (windowHeight > 768) {
            return 450;
        }
        return super.webMaxHeight(windowHeight);
    }

    private async fetchUser() {
        let user: User|null = null;
        if (this.props.route.params.userId !== undefined) {
            user = await this.gameApiService.getUsersById(this.props.route.params.userId);
        } else if (this.props.route.params.username !== undefined) {
            user = await this.gameApiService.getSingleUserByUsername(this.props.route.params.username);
        } else {
            // TODO Error page
        }

        if (user === null) {
            //todo error page
            return;
        }
        this.setState({"user": user});
    }
    didSelectNotToAssign() {
        if (this.props.navigation.canGoBack()) {
            this.props.navigation.pop();
        } else {
            this.props.navigation.replace("SetUpView");
        }
    }
    async didSelectAssignUser() {
        if (this.state.user) {
            await this.userService.setUser(this.state.user);
            this.props.navigation.reset({index: 0, routes: [{name: "UserOverviewView"}]});
        }
    }
    renderView(): React.JSX.Element {
        if (this.state.user === undefined) {
            return (
                <ActivityIndicator></ActivityIndicator>
            )
        }
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
                    loading={this.state.user === undefined}
                    buttonStyle={{
                        height: 160,
                        backgroundColor: 'rgba(111, 202, 186, 1)',
                    }}
                    titleStyle={{ fontWeight: 'bold', fontSize: 32, letterSpacing: 16, }}
                    containerStyle={{
                        height: 160,
                        width: "100%",
                    }}
                    onPress={event => this.didSelectAssignUser()}
                />
            </View>
        );
    }


}