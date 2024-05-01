import {BaseView} from "./BaseView";
import React from "react";
import {Linking, View} from "react-native";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {Game, NULL_TEAM_ID} from "../models/Game";
import {GameList} from "../components/game/GameList";
import {AOE4GameQuery} from "../queries/aoe4games/AOE4GameQuery";
import {H4, ScrollView, Spacer, YStack} from "tamagui";
import {WebHeader} from "../components/scaffolding/WebHeader";
import {User} from "../models/User";
import {UserOverviewBottomSection, UserOverviewBottomSectionProps} from "../components/user/UserOverviewBottomSection";
import {MatchUp} from "../models/MatchUp";
import {LoadingCover} from "../components/scaffolding/LoadingCover";

export type GameDetailsViewProps = {
    gameId: number;
    playerId: number;
    game?: Game;
}
class GameDetailsViewState {
    constructor(public gameId: number,
                public playerId: number,

                public bottomSectionProps: UserOverviewBottomSectionProps|null = null,) { }
}

export class GameDetailsView extends BaseView<MainAppViewProps<"GameDetailsView">, GameDetailsViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;
    @resolve(SERVICE_TYPES.GameApiService)
    private readonly gameApiService!: Aoe4WorldApiService;

    constructor(props: MainAppViewProps<"GameDetailsView">, context: {}) {
        super(props, context);

        this.state = new GameDetailsViewState(
            props.route.params.gameId,
            props.route.params.playerId,
        );

        this.handleLoad();
    }

    async handleLoad() {
        let game = this.props.route.params.game ?? null;

        if (game == null) {
            game = await this.gameApiService.getGame(this.state.playerId, this.state.gameId);
        }
        if (game == null) {
            throw new Error("Can't find game")
        }

        const myTeamId = game.getPlayerById(this.state.playerId)?.teamId ?? NULL_TEAM_ID;
        const matchUpsToCheck: number[] = [];
        game.players.forEach(value => {
            if (value.aoe4WorldId != this.state.playerId) {
                matchUpsToCheck.push(value.aoe4WorldId);
            }
        })
        const matchUps = await this.gameApiService.getMatchUps(this.state.playerId, matchUpsToCheck);
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

        const p: UserOverviewBottomSectionProps = {
            game: game,
            matchUpsFromGameAllies: matchUpsFromGameAllies,
            matchUpsFromGameEnemies: matchUpsFromGameEnemies,
        }
        this.setState({bottomSectionProps: p});
    }
    private openLinkToGame() {
        const link = `https://aoe4world.com/players/${this.state.playerId}/games/${this.state.gameId}`;
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            }
        });
    }
    private openLinkToUser(aoeWorldId: number) {
        const userLink = `https://aoe4world.com/players/${aoeWorldId}`;

        Linking.canOpenURL(userLink).then(supported => {
            if (supported) {
                Linking.openURL(userLink);
            }
        });
    }
    private openMoreGamesSection(matchUp: MatchUp) {
        this.props.navigation.push("GameListView", {q: matchUp.query.queryString, m: false, games: matchUp.games, playerId: this.state.playerId});
    }
    renderView(): React.JSX.Element {
        return (
            <YStack
            >
                <WebHeader
                    title={"Details"}
                />

                <ScrollView
                    paddingLeft={8}
                    paddingRight={8}

                    $gtLg={{
                        paddingLeft: 24,
                        paddingRight: 24,
                    }}
                >
                { this.state.bottomSectionProps != null && (
                    <UserOverviewBottomSection
                        key={"game_details_matchup"}
                        props={this.state.bottomSectionProps}
                        onClickGame={game => this.openLinkToGame()}
                        onClickUser={u => this.openLinkToUser(u.aoe4WorldId)}
                        onMatchUpCardClicked={matchUp => this.openMoreGamesSection(matchUp)}
                    />
                )
                }
                { this.state.bottomSectionProps == null && (
                    <LoadingCover
                        message={"Loading in this momentous grudge"}
                        height={200}
                    />
                )}
                    <Spacer paddingBottom={24} />
                </ScrollView>
            </YStack>
        );
    }


}
