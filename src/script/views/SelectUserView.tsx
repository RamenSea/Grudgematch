import {BaseView} from "./BaseView";
import React from "react";
import {User} from "../models/User";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {UserList} from "../components/user/UserList";
import {H2, YStack} from "tamagui";
import {WebHeader} from "../components/scaffolding/WebHeader";

export type SelectUserViewProps = {
    username: string;
    startingUsersToSelect?: User[];
}
class SelectUserViewState {
    constructor(public usersToSelect: User[]) { }
}
export class SelectUserView extends BaseView<MainAppViewProps<"SelectUserView">, SelectUserViewState> {

    @resolve(SERVICE_TYPES.GameApiService)
    private readonly gameApiService!: Aoe4WorldApiService;

    private readonly userQuery: AOE4WorldUserQuery;

    constructor(props: MainAppViewProps<"SelectUserView">, context: {}) {
        super(props, context);

        this.userQuery = this.gameApiService.getUserQuery(this.props.route.params.username, this.props.route.params.startingUsersToSelect);
        this.state = new SelectUserViewState(this.userQuery.users.slice());
    }

    onWillAppear(firstAppear: boolean) {
        super.onWillAppear(firstAppear);
        this.setState({usersToSelect: [...this.userQuery.users]});
        this.subscribe(this.userQuery.onNextBatch,value => this.nextPageReceived(value));
        if (firstAppear) {
            this.onRequestNextPage();
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
            <YStack
                overflow={"hidden"}
                height={"100%"}
                maxHeight={"100%"}
                minHeight={"100%"}
                paddingLeft={16}
                paddingRight={16}
            >
                <WebHeader
                    title={"Select user"}
                />
                <UserList
                    users={this.state.usersToSelect}
                    onRequestNextPage={() => this.onRequestNextPage()}
                    onSelect={user => this.selectUser(user)}/>
            </YStack>
        );
    }


}