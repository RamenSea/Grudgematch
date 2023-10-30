import {BaseView} from "./BaseView";
import React, {ReactNode} from "react";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {Card, H2, H3, H4, ScrollView, Square, Text, YStack} from "tamagui";
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
import {Linking, View} from "react-native";
import {GameList} from "../components/game/GameList";
import {MatchUpInsides} from "../components/game/MatchUpCard";
import {StandardCard} from "../components/scaffolding/StandardCard";

export type GrudgeViewProps = {
    userOneId?: number,
    userTwoId?: number,
}
class GrudgeViewState {
    constructor(
        //init related vars
        public loadingMatchUp: boolean,
        public userOneId: number|null,
        public userTwoId: number|null,


        //once two users have been set
        public matchUp: MatchUp|null = null,
        public games: Game[] = [],

        public userOneFound: User|null = null,
        public userOneSearchingUsername: string = "",
        public userOneSearchingUsers: User[] = [],
        public userOneDialogIsOpen: boolean = false,
        public userOneDialogIsLoading: boolean = false,

        public userTwoFound: User|null = null,
        public userTwoSearchingUsername: string = "",
        public userTwoSearchingUsers: User[] = [],
        public userTwoDialogIsOpen: boolean = false,
        public userTwoDialogIsLoading: boolean = false,

    ) { }
}

export class GrudgeView extends BaseView<MainAppViewProps<"GrudgeView">, GrudgeViewState> {

    @resolve(SERVICE_TYPES.UserService)
    private readonly userService!: UserService;
    @resolve(SERVICE_TYPES.GameApiService)
    private readonly gameApiService!: Aoe4WorldApiService;

    private findUserOneQuery: AOE4WorldUserQuery|null = null;
    private enteredUserOneTextTimeout: NodeJS.Timeout|null = null;
    private currentUserOneTimeOutUsername: string = "";
    private userOneQuerySubscription: Subscription|null = null;

    private findUserTwoQuery: AOE4WorldUserQuery|null = null;
    private enteredUserTwoTextTimeout: NodeJS.Timeout|null = null
    private currentUserTwoTimeOutUsername: string = "";
    private userTwoQuerySubscription: Subscription|null = null;

    constructor(props: MainAppViewProps<"GrudgeView">, context: {}) {
        super(props, context);
        let userOneId: number|null = this.props.route?.params?.userOneId ?? null;
        let userTwoId: number|null = this.props.route?.params?.userTwoId ?? null;
        if (userOneId == null && this.userService.user.isNull() == false) {
            userOneId = this.userService.user.aoe4WorldId;
        }

        this.state = new GrudgeViewState(
            userOneId != null && userTwoId != null,
            userOneId,
            userTwoId,
        );
        this.routeToFetchStartData();
    }
    onWillAppear(firstAppear: boolean) {
        super.onWillAppear(firstAppear);
        this.checkQuery(null, true);
        this.checkQuery(null, false);
        this.handleQuerySubscription(true, true);
        this.handleQuerySubscription(true, false);
    }
    onWillDisappear() {
        super.onWillDisappear();

        if (this.enteredUserOneTextTimeout != null) {
            clearTimeout(this.enteredUserOneTextTimeout)
            this.enteredUserOneTextTimeout = null;
        }
        if (this.enteredUserTwoTextTimeout != null) {
            clearTimeout(this.enteredUserTwoTextTimeout)
            this.enteredUserTwoTextTimeout = null;
        }
        this.handleQuerySubscription(false, true);
        this.handleQuerySubscription(false, false);
    }
    async routeToFetchStartData() {
        if (this.state.userOneId && this.state.userTwoId) {
            this.fetchMatchUpData(false);
        } else if (this.state.userOneId) {
            const user = await this.gameApiService.getUsersById(this.state.userOneId);
            if (user) {
                this.setState((state) => {
                    if (state.userOneId == user.aoe4WorldId) {
                        return {userOneFound: user};
                    }
                    return null;
                })
            }
        } else if (this.state.userTwoId) {
            const user = await this.gameApiService.getUsersById(this.state.userTwoId);
            if (user) {
                this.setState((state) => {
                    if (state.userTwoId == user.aoe4WorldId) {
                        return {userTwoFound: user};
                    }
                    return null;
                })
            }
        }

    }

    /*
        Finding users section
     */
    private checkQuery(againstUsername: string|null, userOne: boolean) {
        if (userOne) {
            const shouldForce = this.enteredUserOneTextTimeout == null && this.findUserOneQuery?.username != this.currentUserOneTimeOutUsername;
            if ((againstUsername ?? this.state.userOneSearchingUsername) == this.currentUserOneTimeOutUsername && !shouldForce) {
                return;
            }
            if (this.enteredUserOneTextTimeout != null) {
                clearTimeout(this.enteredUserOneTextTimeout)
                this.enteredUserOneTextTimeout = null;
            }

            this.currentUserOneTimeOutUsername = this.state.userOneSearchingUsername;
            this.enteredUserOneTextTimeout = setTimeout(() => this.shouldQueryForUsers(userOne), 500);
        } else {
            const shouldForce = this.enteredUserTwoTextTimeout == null && this.findUserTwoQuery?.username != this.currentUserTwoTimeOutUsername;
            if ((againstUsername ?? this.state.userTwoSearchingUsername) == this.currentUserTwoTimeOutUsername && !shouldForce) {
                return;
            }
            if (this.enteredUserTwoTextTimeout != null) {
                clearTimeout(this.enteredUserTwoTextTimeout)
                this.enteredUserTwoTextTimeout = null;
            }

            this.currentUserTwoTimeOutUsername = this.state.userTwoSearchingUsername;
            this.enteredUserTwoTextTimeout = setTimeout(() => this.shouldQueryForUsers(userOne), 500);
        }
    }
    enteredUsernameDidChange(username: string, userOne: boolean) {
        if (userOne) {
            this.setState({userOneSearchingUsername: username});
        } else {
            this.setState({userTwoSearchingUsername: username});
        }
        this.checkQuery(username, userOne);
    }
    async didSelectUser(user: User, userOne: boolean) {
        if (userOne) {
            await this.asyncSetState({userOneFound: user, userOneId: user.aoe4WorldId, userOneDialogIsOpen: false})
        } else {
            await this.asyncSetState({userTwoFound: user, userTwoId: user.aoe4WorldId, userTwoDialogIsOpen: false})
        }
        if (this.state.userOneFound && this.state.userTwoFound) {
            this.fetchMatchUpData(true);
        }
    }
    requestNextUserPage(userOne: boolean) {
        if (userOne) {
            this.findUserOneQuery?.next();
        } else {
            this.findUserTwoQuery?.next();
        }
    }
    private onNextUserBatch(users: User[], userOne: boolean) {
        if (userOne) {
            this.setState({userOneDialogIsLoading: false, userOneSearchingUsers: this.findUserOneQuery?.users.slice() ?? users});
        } else {
            this.setState({userTwoDialogIsLoading: false, userTwoSearchingUsers: this.findUserTwoQuery?.users.slice() ?? users});
        }
    }
    didPressUserCard(userOne: boolean) {
        if (userOne) {
            this.setState({userOneDialogIsOpen: true})
        } else {
            this.setState({userTwoDialogIsOpen: true})
        }
    }
    private shouldQueryForUsers(userOne: boolean) {
        this.handleQuerySubscription(false, userOne);

        if (userOne) {
            this.findUserOneQuery = this.gameApiService.getUserQuery(this.currentUserOneTimeOutUsername, undefined, true);
            this.setState({userOneSearchingUsers: this.findUserOneQuery.users.slice(), userOneDialogIsLoading: true});
            this.handleQuerySubscription(true, userOne);
            this.findUserOneQuery.next();
        } else {
            this.findUserTwoQuery = this.gameApiService.getUserQuery(this.currentUserTwoTimeOutUsername, undefined, true);
            this.setState({userTwoSearchingUsers: this.findUserTwoQuery.users.slice(), userTwoDialogIsLoading: true});
            this.handleQuerySubscription(true, userOne);
            this.findUserTwoQuery.next();
        }
    }



    /*
        Grudge finding section
     */
    private handleQuerySubscription(shouldSubscribe: boolean, userOne: boolean) {
        if (userOne) {
            if (this.userOneQuerySubscription) {
                this.userOneQuerySubscription.unsubscribe();
                this.userOneQuerySubscription = null;
            }

            if (shouldSubscribe && this.findUserOneQuery) {
                this.userOneQuerySubscription = this.findUserOneQuery.onNextBatch.subscribe(value => this.onNextUserBatch(value, true))
            }
        } else {
            if (this.userTwoQuerySubscription) {
                this.userTwoQuerySubscription.unsubscribe();
                this.userTwoQuerySubscription = null;
            }

            if (shouldSubscribe && this.findUserTwoQuery) {
                this.userTwoQuerySubscription = this.findUserTwoQuery.onNextBatch.subscribe(value => this.onNextUserBatch(value, false))
            }
        }
    }
    async fetchMatchUpData(setLoadingState: boolean) {
        if (this.state.userOneId == null || this.state.userTwoId == null) {
            return;
        }
        if (setLoadingState) {
            await this.asyncSetState({loadingMatchUp: true});
        }
        const matchUp = await this.gameApiService.getMatchUp(this.state.userOneId, this.state.userTwoId);
        if (matchUp == null) {
            console.error("Error finding the match");
            return;
        }

        this.setState({
            matchUp: matchUp,
            games: matchUp.games.slice(),
            userOneFound: matchUp.user,
            userTwoFound: matchUp.opponent,
            loadingMatchUp: false,
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
    requestNextGamePage() {
        this.state.matchUp?.query.next()
    }
    renderView(): React.JSX.Element {
        let userCardSection: ReactNode;
        let grudgeSection: ReactNode| undefined = undefined;

        if (this.mobileBreakPoint()) {
            userCardSection = (
                <>
                    <H4
                        padding={16}
                    >
                        Match up:
                    </H4>
                    <UserCard
                        user={this.state.userOneFound}
                        emptyMessage={this.state.userOneId == null ? "Tap to set the first user": undefined}
                        onClick={ user => this.didPressUserCard(true)}
                        onClickEmpty={ () => this.didPressUserCard(true)}
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
                        user={this.state.userTwoFound}
                        emptyMessage={this.state.userTwoId == null ? "Tap to set the second user": undefined}
                        onClick={ user => this.didPressUserCard(false)}
                        onClickEmpty={ () => this.didPressUserCard(false)}
                    />
                    <SelectUserDialog
                        isOpen={this.state.userOneDialogIsOpen}
                        setIsOpen={isOpen => this.setState({userOneDialogIsOpen: isOpen})}
                        username={this.state.userOneSearchingUsername}
                        onUsernameUpdated={s => this.enteredUsernameDidChange(s, true)}
                        users={this.state.userOneSearchingUsers}
                        onRequestNextPage={() => this.requestNextUserPage(true)}
                        onSelectUser={user => this.didSelectUser(user, true)}
                        isLoading={this.state.userOneDialogIsLoading}
                    />
                    <SelectUserDialog
                        isOpen={this.state.userTwoDialogIsOpen}
                        setIsOpen={isOpen => this.setState({userTwoDialogIsOpen: isOpen})}
                        username={this.state.userTwoSearchingUsername}
                        onUsernameUpdated={s => this.enteredUsernameDidChange(s, false)}
                        users={this.state.userTwoSearchingUsers}
                        onRequestNextPage={() => this.requestNextUserPage(false)}
                        onSelectUser={user => this.didSelectUser(user, false)}
                        isLoading={this.state.userTwoDialogIsLoading}
                    />
                </>
            )
        } else {
            userCardSection = (
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
                    title={"Grudge"}
                />
                {userCardSection}
                {grudgeSection}
            </YStack>
        );

    }


}