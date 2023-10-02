import {BaseRootView} from "./BaseRootView";
import React from "react";
import {User} from "../models/User";
import {Button, Text, View} from "react-native";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";
import {UserCard} from "../components/user/UserCard";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {UserList} from "../components/user/UserList";
import {Subscription} from "@reactivex/rxjs/dist/package";

export type SelectUserViewProps = {
    username: string;
    startingUsersToSelect?: User[];
}
class SelectUserViewState {
    constructor(public usersToSelect: User[]) { }
}
export class SelectUserView extends BaseRootView<"SelectUserView", SelectUserViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;

    @resolve(SERVICE_TYPES.GameApiService)
    private readonly gameApiService!: Aoe4WorldApiService;

    private readonly userQuery: AOE4WorldUserQuery;

    private querySubscription: Subscription|null = null;

    constructor(props: MainAppViewProps<"SelectUserView">, context: {}) {
        super(props, context);
        console.log(this.props.route.params);
        this.userQuery = this.gameApiService.getUserQuery(this.props.route.params.username, this.props.route.params.startingUsersToSelect);
        this.state = new SelectUserViewState(this.userQuery.users.slice());
    }

    onWillAppear() {
        super.onWillAppear();
        this.setState({usersToSelect: [...this.userQuery.users]});
        this.querySubscription = this.userQuery.onNextBatch.subscribe(value => this.nextPageReceived(value));
        this.onRequestNextPage();
    }
    onWillDisappear() {
        super.onWillDisappear();

        if (this.querySubscription != null) {
            this.querySubscription.unsubscribe();
            this.querySubscription = null;
        }
    }

    nextPageReceived(users: User[]) {
        this.setState((state) => ({
           usersToSelect: [...state.usersToSelect, ...users]
        }));
    }
    selectUser(user: User) {
        this.props.navigation.push("AssignUserView", {userId: user.aoe4WorldId});
    }
    onRequestNextPage() {
        this.userQuery.next();
    }
    renderView(): React.JSX.Element {
        return (
            <View>
                <Text
                    style={{
                        marginTop: 32,
                        marginRight: 32,
                        marginLeft: 32,
                        marginBottom: 24,
                        textAlign: "center",
                        fontSize: 24,
                    }}
                >
                    Select the user you want to use:
                </Text>
                <UserList
                    users={this.state.usersToSelect}
                    onRequestNextPage={() => this.onRequestNextPage()}
                    onSelect={user => this.selectUser(user)}/>
            </View>
        );
    }


}