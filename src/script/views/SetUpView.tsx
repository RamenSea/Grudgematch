import {BaseView} from "./BaseView";
import React from "react";
import {MainAppViewProps} from "./RootRoute";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {User} from "../models/User";
import {H1, H2, H5, Input, Paragraph, Spacer, Text, YStack} from "tamagui";
import {Button} from "../components/scaffolding/Button";


class SetUpViewState {
    username: string = "";
    isLoading: boolean = false;
}
export class SetUpView extends BaseView<MainAppViewProps<"SetUpView">, SetUpViewState> {

    @resolve(SERVICE_TYPES.GameApiService)
    private readonly aoe4WorldApiService!: Aoe4WorldApiService;

    constructor(props: MainAppViewProps<"SetUpView">, context: {}) {
        super(props, context);
        console.log("SetUpView")
        this.state = new SetUpViewState();
    }

    protected webMaxHeight(windowHeight: number): number {
        if (windowHeight > 768) {
            return 550;
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
        if (this.state.isLoading) {
            return;
        }
        const usernameToSearch = this.state.username;
        if (this.isUsernameValid(usernameToSearch) == false) {
            return;
        }
        await this.asyncSetState({isLoading: true});

        const exactMatches = await this.aoe4WorldApiService.getUsersByUsername(usernameToSearch, true);
        let exactUser: User|null = null;
        let startingUsersToSelect: User[]|undefined = undefined;
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
            <YStack
                paddingTop={32}
                flex={1}
            >
                <H1
                    textAlign={"center"}
                >
                    Welcome
                </H1>
                <Paragraph
                    marginTop={24}
                    paddingLeft={16}
                    paddingRight={16}
                    fontSize={22}
                    lineHeight={32}
                    textAlign={"center"}

                >
                    Grudge Match is a tool for Age of Empire 4 players to get some quick info about their opponent
                </Paragraph>

                <Spacer
                    height={36}
                />
                <YStack
                >
                    <Text
                        textAlign={"center"}
                        fontSize={18}
                        paddingLeft={16}
                        paddingRight={16}
                        marginBottom={24}
                    >
                        To get started please enter your Age of Empire 4's username
                    </Text>
                    <Input
                        disabled={this.state.isLoading}
                        onChangeText={text => this.onChangeUsernameText(text)}
                        value={this.state.username}
                        placeholder={"Username"}
                        style={{
                            height: 70,
                            marginLeft: 32,
                            marginRight: 32,
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 4,
                        }}
                        onSubmitEditing={e => this.onClickNext()}
                        autoCapitalize={"none"}
                        textContentType={"username"}
                        clearButtonMode="while-editing"
                    />

                </YStack>
                <Spacer
                    flex={1}
                />
                <Button
                    title="NEXT"
                    large={true}
                    theme={"active"}
                    disabled={this.isUsernameValid(this.state.username) == false}
                    loading={this.state.isLoading}
                    onPress={event => this.onClickNext()}
                    removeRoundEdgeOnMobile={true}
                />
            </YStack>
        );
    }
}