import {H4, H5, Separator, SizableText, Spacer, Tabs, Text, YStack} from "tamagui";
import {Game} from "../../models/Game";
import {MatchUp} from "../../models/MatchUp";
import {FlatList, View} from "react-native";
import {GameCard} from "../game/GameCard";
import {MatchUpCard} from "../game/MatchUpCard";
import React from "react";
import {User} from "../../models/User";


export type UserOverviewBottomSectionProps = {
    user: User,
    game: Game,
    matchUpsFromGameAllies: MatchUp[],
    matchUpsFromGameEnemies: MatchUp[],
};
export function UserOverviewBottomSection({
                                              props,
    onClickUser,
    onClickGame,
    onClickMoreGames,
}: {
    props: UserOverviewBottomSectionProps,
    onClickUser: (user: User) => void,
    onClickGame: (game: Game) => void,
    onClickMoreGames: (matchUp: MatchUp) => void,
}) {

    return (
        <YStack
            marginTop={24}
        >
            <H4
                marginLeft={"auto"}
                marginRight={"auto"}
                marginBottom={4}
            >
                - Game found -

            </H4>
            <GameCard
                key={props.game.id}
                game={props.game}
                onClick={onClickGame}
            />
            <H4
                marginLeft={"auto"}
                marginRight={"auto"}
                marginTop={24}
                marginBottom={4}
            >
                - Match ups -

            </H4>
            <Tabs
                defaultValue="allies"
                flex={1}
                width={"100%"}
                flexDirection="column"
                overflow={"visible"}
            >
                <Tabs.List
                    marginBottom={16}
                    paddingLeft={16}
                    paddingRight={16}
                >
                    <Tabs.Tab
                        theme={"softButton"}
                        value="allies"
                        marginLeft={"auto"}
                        flex={1}
                    >
                        <H4>
                            Allies
                        </H4>
                    </Tabs.Tab>
                    <Tabs.Tab
                        theme={"softButton"}
                        value="opponents"
                        marginRight={"auto"}
                        flex={1}
                    >
                        <H4>
                            Opponents
                        </H4>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Content
                    value="allies"
                >
                    <FlatList
                        data={props.matchUpsFromGameAllies}
                        keyExtractor={item => item.opponent.aoe4WorldId + "matchUpAlly"}
                        renderItem={info => {
                            return (
                                <MatchUpCard
                                    against={props.user}
                                    matchUp={info.item}
                                    onUserClick={onClickUser}
                                    onGameClick={onClickGame}
                                    onShowMoreGamesClicked={onClickMoreGames}
                                />
                            )
                        }}
                    />
                </Tabs.Content>
                <Tabs.Content
                    value="opponents"
                >
                    <FlatList
                        data={props.matchUpsFromGameEnemies}
                        keyExtractor={item => item.opponent.aoe4WorldId + "matchUpEnemy"}
                        renderItem={info => {
                            return (
                                <MatchUpCard
                                    against={props.user}
                                    matchUp={info.item}
                                    onUserClick={onClickUser}
                                    onGameClick={onClickGame}
                                    onShowMoreGamesClicked={onClickMoreGames}
                                />
                            )
                        }}
                    />
                </Tabs.Content>
            </Tabs>

        </YStack>
    )
}