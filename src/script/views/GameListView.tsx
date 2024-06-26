import {BaseView} from "./BaseView";
import React from "react";
import {Linking, View} from "react-native";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {Game} from "../models/Game";
import {GameList} from "../components/game/GameList";
import {AOE4GameQuery} from "../queries/aoe4games/AOE4GameQuery";
import {H4, YStack} from "tamagui";
import {WebHeader} from "../components/scaffolding/WebHeader";

export type GameListViewProps = {
    q: string;
    m: boolean
    playerId?: number;
    games?: Game[];
    wasFinishedWithArray?: boolean;
}
class GameListViewState {
    constructor(public games: Game[]) { }
}

export class GameListView extends BaseView<MainAppViewProps<"GameListView">, GameListViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;
    @resolve(SERVICE_TYPES.GameApiService)
    private readonly gameApiService!: Aoe4WorldApiService;

    private readonly query: AOE4GameQuery;
    constructor(props: MainAppViewProps<"GameListView">, context: {}) {
        super(props, context);

        this.query = this.gameApiService.getGameQuery(props.route.params.q, props.route.params.games);

        this.state = new GameListViewState(this.query.games);
    }

    onWillAppear(firstAppear: boolean) {
        super.onWillAppear(firstAppear);

        this.setState({games: this.query.games.slice()});
        this.subscribe(this.query.onNextBatch, t => this.onNextBatchReceived(t));
        if (firstAppear) {
            this.requestNextBatch();
        }
    }

    private openLinkToGame(game: Game) {
        let playerIdToUse = this.props.route.params.playerId;
        if (!playerIdToUse && this.userService.user.isNull() == false) {
            playerIdToUse = this.userService.user.aoe4WorldId;
        }

        if (!playerIdToUse || game.getPlayerById(playerIdToUse) === null) {
            playerIdToUse = game.players[0].aoe4WorldId;
        }

        if (!playerIdToUse) {
            return;
        }
        if (this.props.route.params.m) {
            this.props.navigation.navigate("GameDetailsView", {gameId: game.id, playerId: playerIdToUse, game: game});
            return;
        }
        const link = `https://aoe4world.com/players/${playerIdToUse}/games/${game.id}`;
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            }
        });
    }

    private onNextBatchReceived(games: Game[]) {
        this.setState((state) => ({games: [...state.games, ...games]}));
    }
    private requestNextBatch() {
        this.query.next();
    }
    renderView(): React.JSX.Element {
        return (
            <YStack
                overflow={"hidden"}
                height={"100%"}
                maxHeight={"100%"}
                minHeight={"100%"}
            >
                <WebHeader
                    title={"Games"}
                />
                <GameList
                    user={this.userService.user}
                    games={this.state.games}
                    onRequestNextPage={() => this.requestNextBatch()}
                    onSelect={game => this.openLinkToGame(game)}/>
            </YStack>
        );
    }


}
