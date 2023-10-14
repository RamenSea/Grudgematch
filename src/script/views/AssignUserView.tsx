import {BaseView} from "./BaseView";
import React from "react";
import {User} from "../models/User";
import {ActivityIndicator, View} from "react-native";
import {UserCard} from "../components/user/UserCard";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {H3, Spacer, Text, YStack} from "tamagui";
import {Button} from "../components/scaffolding/Button";


export type AssignUserViewProps = {
    username?: string,
    userId?: number,
}
class AssignUserViewState {
    constructor(
        public user?: User) {
    }
}
export class AssignUserView extends BaseView<MainAppViewProps<"AssignUserView">, AssignUserViewState> {

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
            <YStack
                paddingTop={32}
                flex={1}
            >
                <H3
                    style={{
                        marginRight: 32,
                        marginLeft: 32,
                        marginBottom: 24,
                        textAlign: "center",
                    }}
                >
                    Are you sure this is the correct user?
                </H3>
                <UserCard
                    user={this.state.user}
                />
                <Spacer
                    style={{
                        flex: 1,
                        minHeight: 50,
                    }}
                />
                <Button
                    title={"Wrong account"}
                    onPress={event => this.didSelectNotToAssign()}
                />
                <Spacer
                    style={{
                        height: 8,
                    }}
                />
                <Button
                    theme={"active"}
                    title="ASSIGN"
                    large={true}
                    loading={this.state.user === undefined}
                    onPress={event => this.didSelectAssignUser()}
                />
            </YStack>
        );
    }


}