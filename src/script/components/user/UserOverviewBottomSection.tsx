import {H4, H5, Separator, SizableText, Spacer, Tabs, Text, YStack} from "tamagui";
import {Game} from "../../models/Game";
import {MatchUp} from "../../models/MatchUp";
import {FlatList, View} from "react-native";
import {GameCard} from "../game/GameCard";
import {MatchUpCard} from "../game/MatchUpCard";
import React, {useState} from "react";
import {User} from "../../models/User";


export type UserOverviewBottomSectionProps = {
    game: Game,
    matchUpsFromGameAllies: MatchUp[],
    matchUpsFromGameEnemies: MatchUp[],
};
export function UserOverviewBottomSection({
                                              props,
    onClickUser,
    onClickGame,
                                              onMatchUpCardClicked,
}: {
    props: UserOverviewBottomSectionProps,
    onClickUser: (user: User) => void,
    onClickGame: (game: Game) => void,
    onMatchUpCardClicked: (matchUp: MatchUp) => void,
}) {

    const [tab, setTab] = useState("opponents");
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
                defaultValue={tab}
                onValueChange={setTab}
                flex={1}
                width={"100%"}
                flexDirection="column"
                overflow={"visible"}
            >
                <Tabs.List
                    marginBottom={24}
                    paddingLeft={16}
                    paddingRight={16}
                >
                    <Tabs.Tab
                        theme={"softButton"}
                        value="allies"
                        marginLeft={"auto"}
                        // backgroundColor={tab == "allies" ? "$color6" : undefined}
                        flex={1}
                        flexBasis={1}
                    >
                        <H4>
                            Allies
                        </H4>
                    </Tabs.Tab>
                    <Tabs.Tab
                        theme={"softButton"}
                        value="opponents"
                        marginRight={"auto"}
                        // backgroundColor={tab == "opponents" ? "$color6" : undefined}
                        flex={1}
                        flexBasis={1}
                    >
                        <H4>
                            Opponents
                        </H4>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Content
                    value="allies"
                    overflow={"visible"}
                >
                    {props.matchUpsFromGameAllies.map((value, index) => {

                        const card = (
                            <MatchUpCard
                                key={"match" + value.opponent.aoe4WorldId + "matchUpAlly"}
                                matchUp={value}
                                onUserClick={onClickUser}
                                onMatchUpCardClicked={onMatchUpCardClicked}
                            />
                        );
                        if (index > 0) {
                            return (
                                <React.Fragment
                                    key={"match" + value.opponent.aoe4WorldId + "matchUpAllySPACER"}
                                >
                                    <Spacer
                                        height={8}
                                    />
                                    {card}
                                </React.Fragment>
                            )
                        }
                        return card
                    })}
                </Tabs.Content>
                <Tabs.Content
                    value="opponents"
                >
                    {props.matchUpsFromGameEnemies.map((value, index) => {
                        const card = (
                            <MatchUpCard
                                key={"match" + value.opponent.aoe4WorldId + "opponent"}
                                matchUp={value}
                                onUserClick={onClickUser}
                                onMatchUpCardClicked={onMatchUpCardClicked}
                            />
                        );
                        if (index > 0) {
                            return (
                                <React.Fragment
                                    key={"match" + value.opponent.aoe4WorldId + "opponentSPACER"}
                                >
                                    <Spacer
                                        height={8}
                                    />
                                    {card}
                                </React.Fragment>
                            )
                        }
                        return card
                    })}
                </Tabs.Content>
            </Tabs>

        </YStack>
    )
}
