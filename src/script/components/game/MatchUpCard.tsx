import {Game} from "../../models/Game";
import {Pressable, View} from "react-native";
import {MatchUp} from "../../models/MatchUp";
import {UserCard, UserCardInsides} from "../user/UserCard";
import {User} from "../../models/User";
import {GameCard} from "./GameCard";
import React from "react";
import {Button} from "../scaffolding/Button";
import {Paragraph, Spacer, Text, YStack} from "tamagui";
import {SelectableCard} from "../scaffolding/SelectableCard";
import {StandardCard} from "../scaffolding/StandardCard";

export function MatchUpInsides({
                                matchUp,
}: {
    matchUp: MatchUp,
}) {
    const isFreshMatchUp = matchUp.games.length == 0;
    if (isFreshMatchUp) {
        return (
            <YStack>
                <Text>
                    Fresh match up,
                </Text>
                <Text>
                    Good luck!
                </Text>
            </YStack>
        )
    }

    const percent = matchUp.wins / matchUp.games.length;
    const plural = matchUp.games.length > 1 ? "s" : "";
    return (
        <YStack
        >
            <Paragraph
                fontSize={18}
                marginBottom={8}
            >
                <Text
                    fontWeight={"bold"}
                >
                    {" "}{matchUp.wins}
                </Text>
                <Text
                    fontSize={16}
                >
                    ({(percent * 100).toFixed(0)}%)
                </Text>
                <Text
                >
                    {" "}win{plural} out of {matchUp.didReachLimitOnGames ? "" : "the last "}{matchUp.games.length} game{plural}
                </Text>
            </Paragraph>
            <Text
                fontWeight={"bold"}
                fontSize={14}
            >
                Tap to see the game{plural}
            </Text>
        </YStack>
    )
}


export function MatchUpCard({matchUp,
                                    onUserClick,
                                    onMatchUpCardClicked,
                                }: {
    matchUp: MatchUp,
    onUserClick: (user: User) => void,
    onMatchUpCardClicked: (matchUp: MatchUp) => void,
}) {
    return (
        <SelectableCard
            padding={0}
            overflow={"hidden"}
        >
            <Pressable
                onPress={() => onUserClick(matchUp.opponent)}
            >
                <YStack
                    padding={16}
                    hoverStyle={{ backgroundColor: "$color6" }}
                >
                    <UserCardInsides
                        user={matchUp.opponent}
                    />
                </YStack>
            </Pressable>

            <Spacer
                height={1}
                maxHeight={1}
                minHeight={1}
                width={"100%"}
                backgroundColor={"$color4"}
                marginLeft={"auto"}
                marginRight={"auto"}
            />

            <Pressable
                onPress={() => onMatchUpCardClicked(matchUp)}
            >
                <YStack
                    padding={16}
                    hoverStyle={{ backgroundColor: "$color6" }}
                >
                    <MatchUpInsides
                        matchUp={matchUp}
                    />
                </YStack>
            </Pressable>
        </SelectableCard>
    )
}
