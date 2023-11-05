import {BaseView} from "./BaseView";
import React, {ReactNode} from "react";
import {resolve} from "inversify-react";
import {SERVICE_TYPES} from "../services/ServiceTypes";
import {UserService} from "../services/UserService";
import {MainAppViewProps} from "./RootRoute";
import {Aoe4WorldApiService} from "../services/Aoe4WorldApiService";
import {H2, H3, isWeb, Popover, Spacer, Text, XStack, YStack} from "tamagui";
import {WebHeader} from "../components/scaffolding/WebHeader";
import {User} from "../models/User";
import {UserCard} from "../components/user/UserCard";
import {Button} from "../components/scaffolding/Button";
import {SelectUserDialog} from "../components/dialogs/SelectUserDialog";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";
import {Subscription} from "@reactivex/rxjs/dist/package";
import {Game} from "../models/Game";
import {MatchUp} from "../models/MatchUp";
import { Dimensions, LayoutChangeEvent, Linking, Pressable, Share, View} from "react-native";
import {LoadingCover} from "../components/scaffolding/LoadingCover";
import {GameList} from "../components/game/GameList";
import {StandardCard} from "../components/scaffolding/StandardCard";
import {MatchUpInsides} from "../components/game/MatchUpCard";
import {ChevronsDown, ChevronsUp, Info} from "@tamagui/lucide-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import {ToastService} from "../services/ToastService";

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
        public gameSectionIsExpanded: boolean = false,
        public heightOfTopSection: number = 300,

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
    @resolve(SERVICE_TYPES.ToastService)
    private readonly toastService!: ToastService;

    private findUserOneQuery: AOE4WorldUserQuery|null = null;
    private enteredUserOneTextTimeout: NodeJS.Timeout|null = null;
    private currentUserOneTimeOutUsername: string = "";
    private userOneQuerySubscription: Subscription|null = null;

    private findUserTwoQuery: AOE4WorldUserQuery|null = null;
    private enteredUserTwoTextTimeout: NodeJS.Timeout|null = null
    private currentUserTwoTimeOutUsername: string = "";
    private userTwoQuerySubscription: Subscription|null = null;

    private gameSubscription: Subscription|null = null;

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
        this.setParams();
    }

    protected webMaxHeight(windowHeight: number): number {
        return windowHeight;
    }

    protected webWidth(windowWidth: number): number {
        return Math.min(windowWidth, 768 - 1);
    }
    onWillAppear(firstAppear: boolean) {
        super.onWillAppear(firstAppear);
        this.checkQuery(null, true);
        this.checkQuery(null, false);
        this.checkGameQuery(true)
        this.handleQuerySubscription(true, true);
        this.handleQuerySubscription(true, false);

        if (firstAppear) {
            this.setState({games: this.state.matchUp?.games.slice() ?? this.state.games});
        }
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
        this.checkGameQuery(false)
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
            const shouldForce = this.enteredUserOneTextTimeout == null && this.findUserOneQuery?.username != this.currentUserOneTimeOutUsername && this.currentUserOneTimeOutUsername.length > 3;
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
            const shouldForce = this.enteredUserTwoTextTimeout == null && this.findUserTwoQuery?.username != this.currentUserTwoTimeOutUsername && this.currentUserOneTimeOutUsername.length > 3;
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
        this.setParams();
        if (this.state.userOneFound && this.state.userTwoFound) {
            this.fetchMatchUpData(true);
        }
    }
    private setParams() {
        const setUserIdOne = this.state.userOneId != null && this.state.userOneId != this.userService.user.aoe4WorldId;
        const setUserIdTwo = this.state.userTwoId != null;
        if (setUserIdOne && setUserIdTwo) {
            this.props.navigation.setParams({userOneId: this.state.userOneId!, userTwoId: this.state.userTwoId!});
        } else if (setUserIdOne) {
            this.props.navigation.setParams({userOneId: this.state.userOneId!, userTwoId:undefined});
        } else if (setUserIdTwo) {
            this.props.navigation.setParams({userOneId: undefined, userTwoId: this.state.userTwoId!});
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

    /*
        Grudge finding section
     */
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

        await this.asyncSetState({
            matchUp: matchUp,
            games: matchUp.games.slice(),
            userOneFound: matchUp.user,
            userTwoFound: matchUp.opponent,
            loadingMatchUp: false,
        });
        this.checkGameQuery(true);
    }
    onBottomUserCardDidLayout(layout: LayoutChangeEvent) {
        const bottom = Math.round(layout.nativeEvent.layout.y + layout.nativeEvent.layout.height);
        if (this.state.heightOfTopSection != bottom) {
            this.setState({heightOfTopSection: bottom});
        }
    }
    gameSectionExpandBy(): number {
        const height = Dimensions.get('window').height;
        if (isWeb == false) {
            return height - this.state.heightOfTopSection;
        }
        const width = Dimensions.get('window').width;
        if (width <= 757) {
            return height;
        }
        return height - this.state.heightOfTopSection;
        // return height;
    }
    checkGameQuery(shouldSubscribe: boolean) {
        if (this.gameSubscription != null) {
            this.gameSubscription.unsubscribe()
            this.gameSubscription = null;
        }

        if (shouldSubscribe && this.state.matchUp?.query != null) {
            this.gameSubscription = this.state.matchUp.query.onNextBatch.subscribe(value => this.onNextBatchOfGames())
        }
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
    onNextBatchOfGames() {
        this.setState({games: this.state.matchUp?.games.slice() ?? this.state.games});
    }
    didPressShare(againstMe: boolean) {
        const baseUrl = "https://grudgematch.games/grudge"
        let searchTerms = ""
        if (againstMe) {
            if (this.userService.user.isNull()) {
                this.props.navigation.navigate("SetUpView");
                return;
            }
            searchTerms = `?userTwoId=${this.userService.user.aoe4WorldId}`;
        } else {
            searchTerms = `?userOneId=${this.state.userOneId}&userTwoId=${this.state.userTwoId}`;
        }
        const resolvedUrl = baseUrl + searchTerms;
        if (isWeb) {
            Clipboard.setString(resolvedUrl);
            this.toastService.show("Copied to clipboard");
        } else {
            Share.share({
                url: resolvedUrl,
            });
        }
    }
    renderView(): React.JSX.Element {
        let userCardSection: ReactNode;
        let grudgeSection: ReactNode| undefined = undefined;
        if (this.mobileBreakPoint()) {
            userCardSection = (
                <>
                    <Spacer
                        height={8}
                    />
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
                        onLayout={layout => this.onBottomUserCardDidLayout(layout)}
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
                    <XStack
                        paddingLeft={16}
                        paddingRight={16}
                    >
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
                    </XStack>
                </>
            )
        }

        if (this.state.matchUp) {
            let gameList: ReactNode;
            if (this.mobileBreakPoint() && isWeb == false) {
                const Chevron = this.state.gameSectionIsExpanded ? ChevronsUp : ChevronsDown;
                gameList = (
                    <YStack
                        style={{
                            width: "100%",
                            height: this.gameSectionExpandBy(),
                            paddingBottom: 8,
                        }}
                    >
                        <Pressable
                            onPress={event => this.setState({gameSectionIsExpanded: !this.state.gameSectionIsExpanded})}
                        >
                            <XStack
                                marginTop={16}
                                marginBottom={8}
                                alignItems={"center"}
                            >
                                <Spacer flex={1}/>
                                <Chevron width={24} height={24}/>
                                <H3
                                    marginRight={16}
                                    marginLeft={16}
                                >
                                    Games
                                </H3>
                                <Chevron width={24} height={24}/>
                                <Spacer flex={1}/>
                            </XStack>
                        </Pressable>
                        <GameList
                            user={this.userService.user}
                            games={this.state.games}
                            onRequestNextPage={() => this.requestNextGamePage()}
                            onSelect={game => this.didPressGameCard(game)}
                            nestedScrollEnabled={true}
                        />
                    </YStack>
                )
            } else {
                gameList = (
                    <YStack
                        style={{
                            flex: 1,
                            width:"100%",
                            paddingBottom:8,
                            height: this.gameSectionExpandBy(),
                        }}
                        $md={{
                            height: this.gameSectionExpandBy(),
                        }}
                    >

                        <H3
                            marginTop={16}
                            marginRight={"auto"}
                            marginBottom={8}
                            marginLeft={"auto"}
                        >
                            - Games -
                        </H3>
                        <GameList
                            user={this.userService.user}
                            games={this.state.games}
                            onRequestNextPage={() => this.requestNextGamePage()}
                            onSelect={game => this.didPressGameCard(game)}
                            nestedScrollEnabled={true}
                        />
                    </YStack>
                );
            }
            grudgeSection = (
                <>
                    <StandardCard
                        marginTop={24}
                        marginRight={16}
                        marginLeft={16}
                    >
                        <MatchUpInsides
                            matchUp={this.state.matchUp}
                            showTapToSeeMore={false}
                        />
                    </StandardCard>
                    {gameList}
                </>
            );
        } else if (this.state.loadingMatchUp) {
            grudgeSection = (
                <LoadingCover
                    message={"Loading in this momentous grudge!"}
                    height={200}
                />
            );
        }
        return (
            <YStack
                overflow={"visible"}
                flex={1}
                top={this.state.gameSectionIsExpanded ? -this.state.heightOfTopSection : 0}
            >
                <WebHeader
                    title={"Grudge"}
                />
                <XStack
                    paddingTop={16}
                    paddingRight={16}
                    paddingBottom={16}
                    paddingLeft={16}
                    alignItems={"center"}
                    justifyContent="center"
                    $md={{
                        paddingBottom: 8,
                    }}
                >
                    <H3>
                        Share:
                    </H3>
                    <Spacer flex={1}/>
                    <Button
                        title={"Against me"}
                        marginRight={8}
                        onPress={e => this.didPressShare(true)}
                    />

                    <Popover size="$5" placement={"bottom"}>
                        <Popover.Trigger>
                            <Button
                                icon={Info}
                                backgroundColor={"rgba(0,0,0,0)"}
                            />
                        </Popover.Trigger>
                        <Popover.Content
                            borderWidth={1}
                            borderColor="$borderColor"
                            enterStyle={{ y: -10, opacity: 0 }}
                            exitStyle={{ y: -10, opacity: 0 }}
                            elevate

                            animation={[
                                'quick',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                        >
                            <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

                            <YStack space="$3">
                                <Text>
                                    asdlkfjasdflk;asdf
                                </Text>
                            </YStack>
                        </Popover.Content>
                    </Popover>
                    <Button
                        title={"Current"}
                        disabled={this.state.userOneId == null || this.state.userTwoId == null}
                        onPress={e => this.didPressShare(false)}
                    />
                </XStack>
                {userCardSection}
                {grudgeSection}
            </YStack>
        );

    }


}