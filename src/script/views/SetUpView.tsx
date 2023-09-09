import {BaseRootView} from "./BaseRootView";
import React from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import {MainAppViewProps} from "./RootRoute";
import {useTheme} from "@react-navigation/native";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {User} from "../models/User";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";


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
                user: exactUser,
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
            >
                <Text
                    style={{
                        color: "#000",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    Welcome{'\n'}
                    To Grudge Match!
                </Text>
                <Text
                    style={{
                        color: "#000",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    Grudge match helps you find if you have played against your opponents before
                </Text>
                <Text
                    style={{
                        color: "#000",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    To get started we'll need to know your Age of Empires 4 account
                </Text>
                <TextInput
                    editable={this.state.isLoading == false}
                    style={styles.input}
                    onChangeText={text => this.onChangeUsernameText(text)}
                    value={this.state.username}
                />
                <Button
                    disabled={this.isUsernameValid(this.state.username) == false || this.state.isLoading}
                    onPress={event => this.onClickNext()}
                    title={"Next"}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    body: {
        color: "#000",
    },
    input: {
        color: "#000",
        height: 100,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});