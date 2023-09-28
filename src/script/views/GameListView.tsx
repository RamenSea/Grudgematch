import {BaseRootView} from "./BaseRootView";
import React from "react";
import {User} from "../models/User";
import {Button, Linking, Text, View} from "react-native";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";
import {UserCard} from "../components/user/UserCard";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {UserList} from "../components/user/UserList";
import {Subscription} from "@reactivex/rxjs/dist/package";
import {Game} from "../models/Game";
import {GameList} from "../components/game/GameList";

export type GameListViewProps = {
    games: Game[]| null;
}
class GameListViewState {
    constructor(public games: Game[]) { }
}
export class GameListView extends BaseRootView<"GameListView", GameListViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;

    constructor(props: MainAppViewProps<"GameListView">, context: {}) {
        super(props, context);
        if (this.props.route.params.games != null) {
            this.state = new GameListViewState(this.props.route.params.games);
        } else {
            this.state = new GameListViewState([]);
        }
    }
    private openLinkToGame(game: Game) {
        const user = this.userService.user;
        if (user == null) {
            return;
        }

        const link = `https://aoe4world.com/players/${user.aoe4WorldId}/games/${game.id}`; //todo
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            }
        });
    }
    renderView(): React.JSX.Element {
        return (
            <View>
                <GameList
                    games={this.state.games}
                    onSelect={game => this.openLinkToGame(game)}/>
            </View>
        );
    }


}