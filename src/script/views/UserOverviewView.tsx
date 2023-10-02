import {BaseRootView} from "./BaseRootView";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {MainAppViewProps} from "./RootRoute";
import React from "react";
import {FlatList, Linking, Text, View} from "react-native";
import {User} from "../models/User";
import {UserService} from "../services/UserService";
import {UserCard} from "../components/user/UserCard";
import {MatchUp} from "../models/MatchUp";
import {Game, NULL_TEAM_ID} from "../models/Game";
import {GameCard} from "../components/game/GameCard";
import {MatchUpCard} from "../components/game/MatchUpCard";
import {Button} from "@rneui/themed";

export type UserOverviewViewProps = {
    username?: string
}
class UserOverviewViewState {
    constructor(
        public user: User|null,

        public isFindingGame: boolean = false,

        public mainGame: Game|null = null,
        public matchUpsFromGameAllies: MatchUp[]|null = null,
        public matchUpsFromGameEnemies: MatchUp[]|null = null,
    ) { }
}
export class UserOverviewView extends BaseRootView<"UserOverviewView", UserOverviewViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;

    @resolve(SERVICE_TYPES.GameApiService)
    private readonly aoe4WorldApiService!: Aoe4WorldApiService;

    private isTryingToFindUser = false;
    private usernameFromParams: string|null;
    constructor(props: MainAppViewProps<"UserOverviewView">, context: {}) {
        super(props, context);

        this.usernameFromParams = null;
        if (props.route.params && props.route.params.username) {
            this.usernameFromParams = props.route.params.username;
        }

        if (this.usernameFromParams === null || this.usernameFromParams === this.userService.user.username) {
            this.isTryingToFindUser = true;
            this.state = new UserOverviewViewState(this.userService.user);
        } else if (this.usernameFromParams) {
            this.state = new UserOverviewViewState(null);
            this.findUser();
        } else {
            console.log(new Error("You opened `UserOverviewView` without a user set in UserService or a user specified"));
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

    private async findUser() {
        if (this.isTryingToFindUser) {
            return;
        }
        this.isTryingToFindUser = true;
        if (this.usernameFromParams) {
            const uWithoutDetails = await this.aoe4WorldApiService.getSingleUserByUsername(this.usernameFromParams);
            if (uWithoutDetails !== null) {
                const u = await this.aoe4WorldApiService.getUsersById(uWithoutDetails.aoe4WorldId);
                this.setState({user: u});
            }
        } else {
            console.log(new Error("You opened `UserOverviewView` without a user set in UserService or a user specified"));
        }
    }
    onWillAppear() {
        super.onWillAppear();
        if (this.usernameFromParams === null || this.usernameFromParams === this.userService.user.username) {
            this.subscribe(this.userService.onUserUpdate, (user) => {
                this.setState({user: user});
            });
        }
    }

    didPressingSettingsButton() {
        this.props.navigation.push("SettingsView");
    }
    private openLinkToUser(aoeWorldId: number) {
        const userLink = `https://aoe4world.com/players/${aoeWorldId}`;

        Linking.canOpenURL(userLink).then(supported => {
            if (supported) {
                Linking.openURL(userLink);
            }
        });
    }
    private openLinkToGame(gameId: number) {
        const user = this.state.user;
        if (user == null) {
            return;
        }

        const link = `https://aoe4world.com/players/${user.aoe4WorldId}/games/${gameId}`;
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            }
        });
    }
    private openMoreGamesSection(matchup: MatchUp) {
        this.props.navigation.push("GameListView", { games: matchup.games});
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
        const myTeamId = game.getPlayerById(this.state.user.aoe4WorldId)?.teamId ?? NULL_TEAM_ID;
        const matchUpsToCheck: number[] = [];
        game.players.forEach(value => {
            if (value.aoe4WorldId != this.state.user?.aoe4WorldId) {
                matchUpsToCheck.push(value.aoe4WorldId);
            }
        })
        const matchUps = await this.aoe4WorldApiService.getMatchUps(this.state.user.aoe4WorldId, matchUpsToCheck);
        const matchUpsFromGameAllies: MatchUp[] = []
        const matchUpsFromGameEnemies: MatchUp[] = []
        for (let i = 0; i < matchUps.length; i++) {
            const matchUp = matchUps[i];
            const playerInGame = game.getPlayerById(matchUp.opponent.aoe4WorldId);
            if (playerInGame != null && playerInGame.teamId == myTeamId && myTeamId != NULL_TEAM_ID) {
                matchUpsFromGameAllies.push(matchUp)
            } else {
                matchUpsFromGameEnemies.push(matchUp)
            }
        }
        this.setState({isFindingGame: false, mainGame: game, matchUpsFromGameAllies, matchUpsFromGameEnemies});
    }
    renderView(): React.JSX.Element {
        const user = this.state.user;
        if (user === null || user.isNull()) {
            return (
                <View>
                    <Text>
                        LOADING
                    </Text>
                </View>
            )
        }
        let bottomSection: React.JSX.Element;
        if (this.state.mainGame != null) {
            bottomSection = (
                <View>
                    <GameCard
                        game={this.state.mainGame}
                        onClick={game => this.openLinkToGame(game.id)}
                    />
                    { this.state.matchUpsFromGameAllies != null && this.state.matchUpsFromGameAllies.length > 0 &&
                        <>
                            <Text>
                                Match ups with allies:
                            </Text>
                            <FlatList
                                data={this.state.matchUpsFromGameAllies}
                                renderItem={info => {
                                    return (
                                        <MatchUpCard
                                            against={user}
                                            matchUp={info.item}
                                            onUserClick={user => this.openLinkToUser(user.aoe4WorldId)}
                                            onGameClick={game => this.openLinkToGame(game.id)}
                                            onShowMoreGamesClicked={matchUp => this.openMoreGamesSection(matchUp)}
                                        />
                                    )
                                }}
                            />
                        </>
                    }
                    { this.state.matchUpsFromGameEnemies != null && this.state.matchUpsFromGameEnemies.length > 0 &&
                        <>
                            <Text>
                                Match ups with opponents:
                            </Text>
                            <FlatList
                                data={this.state.matchUpsFromGameEnemies}
                                renderItem={info => {
                                    return (
                                        <MatchUpCard
                                            against={user}
                                            matchUp={info.item}
                                            onUserClick={user => this.openLinkToUser(user.aoe4WorldId)}
                                            onGameClick={game => this.openLinkToGame(game.id)}
                                        />
                                    )
                                }}
                            />
                        </>
                    }
                </View>
            )
        } else {
            bottomSection = (<View/>);
        }
        return (
            <View>
                <UserCard
                    user={user}
                    onClick={user => {this.openLinkToUser(user.aoe4WorldId)}}
                />
                <Button
                    disabled={this.state.isFindingGame}
                    title={"Check"}
                    loading={this.state.isFindingGame}
                    onPress={event => this.didPressCheckCurrentGame()}
                    loadingProps={{ size: 'large', color: 'white' }}
                    buttonStyle={{
                        height: 90,
                        backgroundColor: 'rgba(111, 202, 186, 1)',
                    }}
                    titleStyle={{ fontWeight: 'bold', fontSize: 32, letterSpacing: 16, }}
                    containerStyle={{
                        height: 90,
                        marginTop: 16,
                        width: "100%",
                    }}
                />
                {bottomSection}
            </View>
        );
    }

}