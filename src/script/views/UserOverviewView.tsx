import {BaseView} from "./BaseView";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {MainAppViewProps} from "./RootRoute";
import React from "react";
import {Linking, Button as NativeButton} from "react-native";
import {User} from "../models/User";
import {UserService} from "../services/UserService";
import {UserCard} from "../components/user/UserCard";
import {MatchUp} from "../models/MatchUp";
import {Game, NULL_TEAM_ID} from "../models/Game";
import {AOE4GameQuery} from "../queries/aoe4games/AOE4GameQuery";
import {Button} from "../components/scaffolding/Button";
import {H4, isWeb, ScrollView, Spacer, Spinner, Text, XStack, YStack} from "tamagui";
import {ThemedSpinner} from "../components/scaffolding/ThemedSpinner";
import {LoadingCover} from "../components/scaffolding/LoadingCover";
import {UserOverviewBottomSection, UserOverviewBottomSectionProps} from "../components/user/UserOverviewBottomSection";
import {ListenForGame} from "../general/ListenForGame";
import {WebHeader} from "../components/scaffolding/WebHeader";
import {Settings} from "@tamagui/lucide-icons";

export type UserOverviewViewProps = {
    username?: string|undefined
}
class UserOverviewViewState {
    constructor(
        public user: User|null,

        public isFindingGame: boolean = false,
        public isFindingPlayingGame: boolean = false,

        public bottomSectionProps: UserOverviewBottomSectionProps|null = null,
    ) { }
}
export class UserOverviewView extends BaseView<MainAppViewProps<"UserOverviewView">, UserOverviewViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;

    @resolve(SERVICE_TYPES.GameApiService)
    private readonly aoe4WorldApiService!: Aoe4WorldApiService;

    private isTryingToFindUser = false;
    private usernameFromParams: string|null;
    private listenForGame: ListenForGame|null = null;

    constructor(props: MainAppViewProps<"UserOverviewView">, context: {}) {
        super(props, context);

        this.usernameFromParams = null;
        if (props.route.params && props.route.params.username) {
            this.usernameFromParams = props.route.params.username;
        }

        if (this.userService.user.isNull() == false &&
            (this.usernameFromParams === this.userService.user.username || this.usernameFromParams == null)) {
            this.isTryingToFindUser = true;
            this.state = new UserOverviewViewState(this.userService.user);
        } else if (this.usernameFromParams) {
            this.state = new UserOverviewViewState(null);
            this.findUser();
        } else {
            this.state = new UserOverviewViewState(null);
            props.navigation.replace("SetUpView");
        }

        if (isWeb == false) {
            this.props.navigation.setOptions({
                headerRight: () => {
                    return (
                        <Button
                            icon={<Settings size={24}/>}
                            backgroundColor={"rgba(0,0,0,0)"}
                            onPress={event => this.didPressingSettingsButton()}
                        />
                    )
                }
            })
        }
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

    onWillAppear(firstAppear: boolean) {
        super.onWillAppear(firstAppear);
        if (this.usernameFromParams === null || this.usernameFromParams === this.userService.user.username) {
            this.subscribe(this.userService.onUserUpdate, (user) => {
                this.setState({user: user});
            });
        }
    }
    didPressingSettingsButton() {
        this.props.navigation.push("SettingsView");
    }
    didPressFindButton() {
        this.props.navigation.push("GrudgeView", {});
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
    private openMoreGamesSection(matchUp: MatchUp) {
        this.props.navigation.push("GameListView", {q: matchUp.query.queryString, games: matchUp.games, playerId: this.state.user?.aoe4WorldId});
    }
    private didPressRecent() {
        if (this.state.user == null) {
            return;
        }
        this.props.navigation.push("GameListView", {q: AOE4GameQuery.CreateRecentQuery(this.state.user.aoe4WorldId), playerId: this.state.user?.aoe4WorldId});
    }
    private async didPressCheckCurrentGame() {
        if (this.isLoadingInAGame() ||
            this.state.user == null) {
            return;
        }
        await this.asyncSetState({isFindingGame: true});
        const games = await this.aoe4WorldApiService.getGames(this.state.user.aoe4WorldId, -1, 1);
        if (games.length === 0) {
            this.failedToFindGame(false);
            return;
        }
        const game = games[0];
        this.getMatchForGame(game, false);
    }
    private cancelListeningForPlayingGames() {
        if (this.listenForGame != null) {
            this.listenForGame.cancel();
        }
        this.setState({isFindingGame: false, isFindingPlayingGame: false});
    }
    private async didPressListenForPlayingGame() {
        if (this.isLoadingInAGame() ||
            this.state.user == null) {
            return;
        }
        await this.asyncSetState({isFindingPlayingGame: true, bottomSectionProps: null});

        this.listenForGame = new ListenForGame(this.aoe4WorldApiService, this.state.user, game => {
            if (game) {
                this.getMatchForGame(game, true)
            } else {
                this.failedToFindGame(true);
            }
        });
        this.listenForGame.start();
    }
    private async getMatchForGame(game: Game, wasPlayingGameCheck: boolean) {
        if (this.state.user == null) {
            this.failedToFindGame(wasPlayingGameCheck);
            return;
        }
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
        const bottomProps: UserOverviewBottomSectionProps = {
            user: this.state.user,
            game: game,
            matchUpsFromGameAllies: matchUpsFromGameAllies,
            matchUpsFromGameEnemies: matchUpsFromGameEnemies,
        }
        this.setState({isFindingGame: false, isFindingPlayingGame: false, bottomSectionProps: bottomProps});
    }
    private async failedToFindGame(wasPlayingGameCheck: boolean) {
        this.setState({isFindingGame: false, isFindingPlayingGame: false});
    }
    private isLoadingInAGame() {
        return this.state.isFindingPlayingGame || this.state.isFindingGame;
    }
    renderView(): React.JSX.Element {
        const user = this.state.user;
        if (user === null || user.isNull()) {
            return (
                <LoadingCover
                    message={"Loading user"}
                />
            )
        }

        return (
            <YStack
            >
                <WebHeader
                    title={"Overview"}
                    rightButtonProps={{
                        icon: (<Settings size={24}/>),
                        backgroundColor: "rgba(0,0,0,0)",
                        onPress: event => this.didPressingSettingsButton(),
                    }}
                />
                <ScrollView
                    paddingLeft={8}
                    paddingRight={8}

                    $gtLg={{
                        paddingLeft: 24,
                        paddingRight: 24,
                    }}
                >
                    <XStack
                        paddingTop={16}
                        paddingBottom={16}
                    >
                        <H4
                            marginTop={"auto"}
                            marginBottom={"auto"}
                        >
                            Assigned user:
                        </H4>
                        <Spacer flex={1}/>
                        <Button
                            marginTop={"auto"}
                            marginBottom={"auto"}
                            title={"Grudge"}
                            onPress={event => this.didPressFindButton()}
                        />
                    </XStack>
                    <UserCard
                        user={user}
                        onClick={user => {this.openLinkToUser(user.aoe4WorldId)}}
                    />
                    <XStack
                        marginTop={16}
                    >
                        {this.state.isFindingPlayingGame &&
                            <Button
                                dangerous={true}
                                title={"Cancel finding game"}
                                flex={1}
                                onPress={event => this.cancelListeningForPlayingGames()}
                            />
                        }
                        {!this.state.isFindingPlayingGame &&
                            <>
                                <Button
                                    title={"Recent"}
                                    flex={1}
                                    onPress={event => this.didPressRecent()}
                                    marginRight={8}
                                />
                                <Button
                                    disabled={this.isLoadingInAGame()}
                                    title={"Check last"}
                                    loading={this.isLoadingInAGame()}
                                    flex={1}
                                    onPress={event => this.didPressCheckCurrentGame()}
                                    marginRight={8}
                                />
                                <Button
                                    disabled={this.isLoadingInAGame()}
                                    title={"Listen"}
                                    loading={this.isLoadingInAGame()}
                                    flex={1}
                                    onPress={event => this.didPressListenForPlayingGame()}
                                    marginLeft={8}
                                />
                            </>
                        }
                    </XStack>
                    {this.state.isFindingPlayingGame &&
                        <>
                            <H4
                                marginTop={32}
                                marginLeft={"auto"}
                                marginRight={"auto"}
                            >
                                Waiting for your game to start...
                            </H4>
                            <ThemedSpinner
                                marginTop={8}
                                marginLeft={"auto"}
                                marginRight={"auto"}
                            />
                        </>
                    }
                    {this.state.bottomSectionProps != null &&
                        <UserOverviewBottomSection
                            key={"bottom_section_todo"}
                            props={this.state.bottomSectionProps}
                            onClickGame={game => this.openLinkToGame(game.id)}
                            onClickUser={u => this.openLinkToUser(u.aoe4WorldId)}
                            onMatchUpCardClicked={matchUp => this.openMoreGamesSection(matchUp)}
                        />
                    }
                    <Spacer height={8}/>
                </ScrollView>
            </YStack>
        );
    }

}
