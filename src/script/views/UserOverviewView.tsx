import {BaseRootView} from "./BaseRootView";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {MainAppViewProps} from "./RootRoute";
import React from "react";
import {ActivityIndicator, Button, FlatList, Text, View} from "react-native";
import {User} from "../models/User";
import {UserService} from "../services/UserService";
import {UserCard} from "../components/user/UserCard";
import {MatchUp} from "../models/MatchUp";
import {Game} from "../models/Game";
import {GameCard} from "../components/game/GameCard";
import {MatchUpCard} from "../components/game/MatchUpCard";

export type UserOverviewViewProps = {
    selectedUser: User|null;
}
class UserOverviewViewState {
    constructor(
        public user: User|null,

        public isFindingGame: boolean = false,

        public mainGame: Game|null = null,
        public matchUpsFromGame: MatchUp[]|null = null,
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

        this.props.navigation.setOptions({
            headerRight: () => {
                return (
                    <Button
                        title={"Settings"}
                        onPress={event => this.didPressingSettingsButton()}
                    />
                )
            }
        })
    }

    didPressingSettingsButton() {
        this.props.navigation.push("SettingsView");
    }
    private async didPressCheckCurrentGame() {
        if (this.state.isFindingGame ||
            this.state.user == null) {
            return;
        }
        await this.asyncSetState({isFindingGame: true});
        const games = await this.aoe4WorldApiService.getGames(this.state.user.aoe4WorldId, -1, 1);
        if (games.length === 0) {
            this.setState({isFindingGame: false});
            return;
        }

        const game = games[0];
        const matchUpsToCheck = game.players.map(value => value.aoe4WorldId);
        const matchUps = await this.aoe4WorldApiService.getMatchUps(this.state.user.aoe4WorldId, matchUpsToCheck);
        this.setState({isFindingGame: false, mainGame: game, matchUpsFromGame: matchUps});
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
        let bottomSection: React.JSX.Element;
        if (this.state.isFindingGame) {
            bottomSection = (
                <ActivityIndicator
                />
            )
        } else if (this.state.mainGame != null && this.state.matchUpsFromGame != null) {
            bottomSection = (
                <View>
                    <GameCard
                        game={this.state.mainGame}
                    />
                    <FlatList
                        data={this.state.matchUpsFromGame}
                        renderItem={info => {
                            return (
                                <MatchUpCard
                                    matchUp={info.item}
                                />
                            )
                        }}
                    />
                </View>
            )
        } else {
            bottomSection = (<View/>);
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
                    disabled={this.state.isFindingGame}
                    title={"Check current game"}
                    onPress={event => this.didPressCheckCurrentGame()}
                />
                {bottomSection}
            </View>
        );
    }

}