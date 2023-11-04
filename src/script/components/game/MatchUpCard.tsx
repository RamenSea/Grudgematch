import {Pressable} from "react-native";
import {MatchUp} from "../../models/MatchUp";
import {UserCardInsides} from "../user/UserCard";
import {User} from "../../models/User";
import React from "react";
import {Paragraph, Spacer, Text, YStack} from "tamagui";
import {SelectableCard} from "../scaffolding/SelectableCard";

export function MatchUpInsides({
                                matchUp,
                                   showTapToSeeMore,
}: {
    matchUp: MatchUp,
    showTapToSeeMore: boolean,
}) {
    const isFreshMatchUp = matchUp.totalCompletedGames == 0;
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

    const percent = matchUp.wins / matchUp.totalCompletedGames;

    let matchUpText = ""
    if (matchUp.totalCompletedGames < 3) {
        matchUpText = "A fresh grudge is brewing";
    } else if (percent >= 0.9) {
        matchUpText = "Auto-concede Grudge";
    } else if (percent >= 0.8) {
        matchUpText = "Stalwart Hatred Grudge";
    } else if (percent >= 0.7) {
        matchUpText = "Vanguard Grudge";
    } else if (percent >= 0.6) {
        matchUpText = "Hard Fought Grudge";
    }  else if (percent >= 0.5) {
        matchUpText = "Hard Fought Grudge";
    }  else if (percent >= 0.4) {
        matchUpText = "Hard Fought Grudge";
    }  else if (percent >= 0.3) {
        matchUpText = "Bully Grudge";
    } else {
        matchUpText = "Arch-nemesis Grudge";
    }
    const plural = matchUp.totalCompletedGames > 1 ? "s" : "";
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
                    {" "}({(percent * 100).toFixed(0)}%)
                </Text>
                <Text
                >
                    {" "}win{plural} out of {matchUp.query.isFinished ? "" : "the last "}{matchUp.totalCompletedGames} game{plural}
                </Text>
            </Paragraph>
            <Text
                fontSize={18}
                fontWeight={"600"}
                textAlign={"center"}
            >
                {matchUpText}
            </Text>
            { showTapToSeeMore &&
                <Text
                    fontWeight={"bold"}
                    fontSize={14}
                >
                    Tap to see the game{plural}
                </Text>
            }
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
            hoverStyle={{ backgroundColor: "$color2" }}
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
                        showTapToSeeMore={true}
                    />
                </YStack>
            </Pressable>
        </SelectableCard>
    )
}
