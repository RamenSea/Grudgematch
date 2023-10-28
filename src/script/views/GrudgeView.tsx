import {BaseView} from "./BaseView";
import React, {ReactNode} from "react";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {H2, H3, H4, Text, YStack} from "tamagui";
import {WebHeader} from "../components/scaffolding/WebHeader";
import {User} from "../models/User";
import {SelectableCard} from "../components/scaffolding/SelectableCard";
import {UserCard} from "../components/user/UserCard";
import {Button} from "../components/scaffolding/Button";
import {SelectUserDialog} from "../components/dialogs/SelectUserDialog";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";
import {Subscription} from "@reactivex/rxjs/dist/package";
import {Game} from "../models/Game";
import {MatchUp} from "../models/MatchUp";
import {LoadingCover} from "../components/scaffolding/LoadingCover";
import {Linking} from "react-native";
import {GameList} from "../components/game/GameList";

export type GrudgeViewProps = {
    userTwoId: number,
    userOneId: number,
}
class GrudgeViewState {
    constructor(
        public matchUp: MatchUp|null = null,

        public games: Game[] = [],
    ) { }
}

export class GrudgeView extends BaseView<MainAppViewProps<"GrudgeView">, GrudgeViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;
    @resolve(SERVICE_TYPES.GameApiService)
    private readonly gameApiService!: Aoe4WorldApiService;

    constructor(props: MainAppViewProps<"GrudgeView">, context: {}) {
        super(props, context);
        this.state = new GrudgeViewState(
        );
        this.fetchData();
    }
    onWillAppear(firstAppear: boolean) {
        super.onWillAppear(firstAppear);
    }
    onWillDisappear() {
        super.onWillDisappear();
    }

    async fetchData() {
        const matchUp = await this.gameApiService.getMatchUp(this.props.route.params.userOneId, this.props.route.params.userTwoId);
        if (matchUp == null) {
            console.error("Error finding the match");
            return;
        }

        this.setState({matchUp: matchUp, games: matchUp.games.slice()});
    }
    didSelectUser(user: User) {
        const link = `https://aoe4world.com/players/${user.aoe4WorldId}/`;
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            }
        });
    }
    didPressGameCard(game: Game) {
        const link = `https://aoe4world.com/players/${this.props.route.params.userTwoId}/games/${game.id}`;
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            }
        });
    }
    requestNextPage() {
        this.state.matchUp?.query.next()
    }
    private onNextUserBatch(games: Game[]) {
        this.setState({games: this.state.matchUp?.games.slice() ?? games});
    }
    renderView(): React.JSX.Element {
        if ( this.state.matchUp == null) {
            return (
                <LoadingCover
                    message={"Loading in this momentous grudge"}
                />
            )
        }
        let topPortion: ReactNode;
        if (this.mobileBreakPoint()) {
            topPortion = (
                <>
                    <H4
                        padding={16}
                    >
                        Match up:
                    </H4>
                    <UserCard
                        user={this.state.matchUp.user}
                        onClick={(e) => this.didSelectUser(this.state.matchUp!.user)}
                    />
                    <H2
                        marginTop={24}
                        marginRight={"auto"}
                        marginBottom={24}
                        marginLeft={"auto"}
                    >
                        VS
                    </H2>
                    <UserCard
                        user={this.state.matchUp.opponent}
                        onClick={(e) => this.didSelectUser(this.state.matchUp!.opponent)}
                    />
                </>
            )
        } else {
            topPortion = (
                <>
                    <Text>TODO</Text>
                </>
            )
        }
        return (
            <YStack
                overflow={"hidden"}
                flex={1}
            >
                <WebHeader
                    title={"Find"}
                />
                {topPortion}
                <Text>
                    SOMETHIGN about a grudge
                </Text>
                <Text>
                    - Games -
                </Text>
                <YStack
                    height={500}
                >
                    <GameList
                        games={this.state.games}
                        onRequestNextPage={() => this.requestNextPage()}
                        onSelect={game => this.didPressGameCard(game)}
                    />
                </YStack>
            </YStack>
        );
    }


}