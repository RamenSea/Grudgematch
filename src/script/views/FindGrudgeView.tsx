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
import {GameList} from "../components/game/GameList";
import {Linking} from "react-native";
import {Game} from "../models/Game";

class FindGrudgeViewState {
    constructor(
        public firstUserFound: User|null = null,
        public secondUserFound: User|null = null,
        public searchingUsername: string = "",
        public searchingUsers: User[] = [],

        public isSearchingForFirstUser: boolean = false,
        public findUserDialogIsOpen: boolean = false,
        public findUserDialogIsLoading: boolean = false,
    ) { }
}

export class FindGrudgeView extends BaseView<MainAppViewProps<"FindGrudgeView">, FindGrudgeViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;
    @resolve(SERVICE_TYPES.GameApiService)
    private readonly gameApiService!: Aoe4WorldApiService;

    private findUserQuery: AOE4WorldUserQuery|null = null;

    private enteredTextTimeout: NodeJS.Timeout|null = null
    private currentTimeOutUsername: string = "";
    private querySubscription: Subscription|null = null;

    constructor(props: MainAppViewProps<"FindGrudgeView">, context: {}) {
        super(props, context);
        this.state = new FindGrudgeViewState();
    }

    onWillAppear(firstAppear: boolean) {
        super.onWillAppear(firstAppear);
        this.checkQuery();
        this.handleQuerySubscription(true);
    }
    onWillDisappear() {
        super.onWillDisappear();

        if (this.enteredTextTimeout != null) {
            clearTimeout(this.enteredTextTimeout)
            this.enteredTextTimeout = null;
        }
        this.handleQuerySubscription(false);
    }

    enteredUsernameDidChange(username: string) {
        this.setState({searchingUsername: username});
        this.checkQuery(username);
    }
    didSelectUser(user: User) {
        if (this.state.isSearchingForFirstUser) {
            this.setState({firstUserFound: user, findUserDialogIsOpen: false})
        } else {
            this.setState({secondUserFound: user, findUserDialogIsOpen: false})
        }
    }
    requestNextPage() {
        this.findUserQuery?.next();
    }
    findGrudge() {
        const userOne = this.state.firstUserFound;
        const userTwo = this.state.secondUserFound;
        if (!userOne || !userTwo) {
            return;
        }
        this.props.navigation.navigate("GrudgeView", {userOneId: userOne.aoe4WorldId, userTwoId: userTwo.aoe4WorldId });
    }
    private checkQuery(againstUsername: string|null = null) {
        const shouldForce = this.enteredTextTimeout == null && this.findUserQuery?.username != this.currentTimeOutUsername;
        if ((againstUsername ?? this.state.searchingUsername) == this.currentTimeOutUsername && !shouldForce) {
            return;
        }
        if (this.enteredTextTimeout != null) {
            clearTimeout(this.enteredTextTimeout)
            this.enteredTextTimeout = null;
        }

        this.currentTimeOutUsername = this.state.searchingUsername;
        this.enteredTextTimeout = setTimeout(() => this.shouldQueryForUsers(), 500);
    }
    private shouldQueryForUsers() {
        this.handleQuerySubscription(false);

        this.findUserQuery = this.gameApiService.getUserQuery(this.currentTimeOutUsername, undefined, true);
        this.setState({searchingUsers: this.findUserQuery.users.slice(), findUserDialogIsLoading: true});
        this.handleQuerySubscription(true);
        this.findUserQuery.next();
    }

    private handleQuerySubscription(shouldSubscribe: boolean) {
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
            this.querySubscription = null;
        }
        if (shouldSubscribe && this.findUserQuery) {
            this.querySubscription = this.findUserQuery.onNextBatch.subscribe(value => this.onNextUserBatch(value))
        }
    }
    private onNextUserBatch(users: User[]) {
        this.setState({findUserDialogIsLoading: false, searchingUsers: this.findUserQuery?.users.slice() ?? users});
    }
    didPressUserCard(isUserOne: boolean) {
        this.setState({findUserDialogIsOpen: true, isSearchingForFirstUser: isUserOne})
    }

    canGoToGrudgeScreen() : boolean {
        return this.state.secondUserFound != null && this.state.secondUserFound != null;
    }
    renderView(): React.JSX.Element {
        let body: ReactNode;
        if (this.mobileBreakPoint()) {
            let userOneComponent: ReactNode;
            if (this.state.firstUserFound) {
                userOneComponent = (
                    <UserCard
                        user={this.state.firstUserFound}
                        onClick={(e) => this.didPressUserCard(true)}
                    />
                )
            } else {
                userOneComponent = (
                    <SelectableCard
                        onPress={(e) => this.didPressUserCard(true)}
                        marginLeft={8}
                        marginRight={8}
                    >
                        <H3>
                            Tap to set the first user
                        </H3>
                    </SelectableCard>
                );
            }
            let userTwoComponent: ReactNode;
            if (this.state.secondUserFound) {
                userTwoComponent = (
                    <UserCard
                        user={this.state.secondUserFound}
                        onClick={(e) => this.didPressUserCard(false)}
                    />
                )
            } else {
                userTwoComponent = (
                    <SelectableCard
                        onPress={(e) => this.didPressUserCard(false)}
                        marginLeft={8}
                        marginRight={8}
                    >
                        <H3>
                            Tap to set the second user
                        </H3>
                    </SelectableCard>
                );
            }
            body = (
                <>
                    <H4
                        padding={16}
                    >
                        Match up:
                    </H4>
                    {userOneComponent}
                    <H2
                        marginTop={24}
                        marginRight={"auto"}
                        marginBottom={24}
                        marginLeft={"auto"}
                    >
                        VS
                    </H2>
                    {userTwoComponent}
                    <Button
                        marginTop={"auto"}
                        large={true}
                        disabled={this.canGoToGrudgeScreen() == false}
                        title={"Grudge"}
                        removeRoundEdgeOnMobile={true}
                        onPress={e => this.findGrudge()}
                    />
                    <SelectUserDialog
                        isOpen={this.state.findUserDialogIsOpen}
                        setIsOpen={isOpen => this.setState({findUserDialogIsOpen: isOpen})}
                        username={this.state.searchingUsername}
                        onUsernameUpdated={s => this.enteredUsernameDidChange(s)}
                        users={this.state.searchingUsers}
                        onRequestNextPage={() => this.requestNextPage()}
                        onSelectUser={user => this.didSelectUser(user)}
                        isLoading={this.state.findUserDialogIsLoading}
                    />
                </>
            )
        } else {
            body = (
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
                {body}
            </YStack>
        );
    }


}