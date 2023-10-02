import {BaseRootView} from "./BaseRootView";
import React from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import {MainAppViewProps} from "./RootRoute";
import {useTheme} from "@react-navigation/native";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {User} from "../models/User";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";
import { Button } from '@rneui/themed';


class SetUpViewState {
    username: string = "";
    isLoading: boolean = false;
}
export class SetUpView extends BaseRootView<"SetUpView", SetUpViewState> {

    @resolve(SERVICE_TYPES.GameApiService)
    private readonly aoe4WorldApiService!: Aoe4WorldApiService;

    constructor(props: MainAppViewProps<"SetUpView">, context: {}) {
        super(props, context);
        this.state = new SetUpViewState();
    }

    protected webMaxHeight(windowHeight: number): number {
        if (windowHeight > 768) {
            return 450;
        }
        return super.webMaxHeight(windowHeight);
    }

    isUsernameValid(username: string|null): boolean {
        return username != null && username.length >= User.MIN_USERNAME_LENGTH;
    }
    onChangeUsernameText(text: string) {
        this.setState({username: text});
        this.setState((state) => ({
            username: text,
        }));
    }
    async onClickNext() {
        const usernameToSearch = this.state.username;
        if (this.isUsernameValid(usernameToSearch) == false) {
            return;
        }
        await this.asyncSetState({isLoading: true});

        const exactMatches = await this.aoe4WorldApiService.getUsersByUsername(usernameToSearch, true);
        let exactUser: User|null = null;
        let startingUsersToSelect: User[]|null = null;
        if (exactMatches != null && exactMatches.length > 0) {
            exactUser = exactMatches[0];
        } else {
            const query = this.aoe4WorldApiService.getUserQuery(usernameToSearch);
            await query.next();
            if (query.users.length == 0) {
                //throw issue here
            } else if (query.users.length == 1) {
                exactUser = query.users[0];
            } else {
                startingUsersToSelect = query.users;
            }
        }
        await this.asyncSetState({isLoading: false});

        if (exactUser != null) {
            this.props.navigation.push("AssignUserView", {
                userId: exactUser.aoe4WorldId
            });
        } else {
            this.props.navigation.push("SelectUserView", {
                username: usernameToSearch,
                startingUsersToSelect: startingUsersToSelect,
            });
        }
    }
    renderView(): React.JSX.Element {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    flexDirection: "column",
                }}
            >
                <Text
                    style={{
                        color: "#000",
                        width: "100%",
                        textAlign: "center",
                        marginTop: 16,
                        fontSize: 32,
                        fontWeight: "800",
                    }}
                >
                    Welcome
                </Text>
                <Text
                    style={{
                        marginTop: 16,
                        paddingLeft: 24,
                        paddingRight: 24,
                        color: "#000",
                        width: "100%",
                        textAlign: "left",
                    }}
                >
                    Grudge Match helps you get some quick info about your opponent
                </Text>
                <Text
                    style={{
                        marginTop: 24,
                        paddingLeft: 24,
                        paddingRight: 24,
                        color: "#000",
                        width: "100%",
                        textAlign: "left",
                    }}
                >
                    To get started please enter your Age of Empire's 4 username
                </Text>

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <TextInput
                            editable={this.state.isLoading == false}
                            onChangeText={text => this.onChangeUsernameText(text)}
                            value={this.state.username}
                            placeholder={"Username"}
                            style={{
                                color: "#000",
                                height: 70,
                                marginLeft: 32,
                                marginRight: 32,
                                borderWidth: 1,
                                padding: 10,
                            }}
                        />
                    </View>
                    <Button
                        title="NEXT"
                        disabled={this.isUsernameValid(this.state.username) == false}
                        loading={this.state.isLoading}
                        loadingProps={{ size: 'large', color: 'white' }}
                        buttonStyle={{
                            height: 160,
                            backgroundColor: 'rgba(111, 202, 186, 1)',
                        }}
                        titleStyle={{ fontWeight: 'bold', fontSize: 32, letterSpacing: 16, }}
                        containerStyle={{
                            height: 160,
                            width: "100%",
                        }}
                        onPress={event => this.onClickNext()}
                    />
                </View>
            </View>
        );
    }
}