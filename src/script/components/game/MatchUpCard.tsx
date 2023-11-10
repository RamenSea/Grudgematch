import {Pressable} from "react-native";
import {MatchUp} from "../../models/MatchUp";
import {UserCardInsides} from "../user/UserCard";
import {User} from "../../models/User";
import React from "react";
import {Paragraph, Spacer, Text, YStack} from "tamagui";
import {SelectableCard} from "../scaffolding/SelectableCard";

function GetLengthGrudge(gameCount: number): string {
    if (gameCount < 3) {
        return "Fresh"
    } else if (gameCount < 7) {
        return "Growing"
    } else if (gameCount < 15) {
        return "Blooming"
    } else if (gameCount < 24) {
        return "Flourishing"
    } else if (gameCount < 35) {
        return "Established"
    } else if (gameCount < 43) {
        return "Dependant"
    }
    return "Lovingly"
}
function GetNamedGrudge(percent: number, isAgainst: boolean): string {
    if (isAgainst == false) {
        percent = 1.0 - percent; // flip if its an ally
    }
    if (percent >= 0.9) {
        return "Auto-concede";
    } else if (percent >= 0.8) {
        return isAgainst ? "Stalwart" : "Questionable";
    } else if (percent >= 0.7) {
        return isAgainst ? "Vanguard" : "Tumultuous";
    } else if (percent >= 0.6) {
        return "Hard Fought";
    }  else if (percent >= 0.5) {
        return "Hard Fought";
    }  else if (percent >= 0.4) {
        return "Hard Fought";
    }  else if (percent >= 0.3) {
        return "Bullying";
    } else {
        return isAgainst ? "Arch-nemesis" : "Barbaric";
    }
}
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
    const hasGamesWith = matchUp.gamesWith > 0;
    const hasGamesAgainst = matchUp.gamesAgainst > 0;

    const percentWith = matchUp.winsWith / matchUp.gamesWith;
    const percentAgainst = matchUp.winsAgainst / matchUp.gamesAgainst;

    const moreWith = matchUp.gamesWith >= matchUp.gamesAgainst
    const grudgeText = `${GetLengthGrudge(moreWith ? matchUp.gamesWith : matchUp.gamesAgainst)} ${GetNamedGrudge(moreWith ? percentWith : percentAgainst, moreWith == false)} ${moreWith ? "Friendship" : "Grudge"}`

    const totalPlural = matchUp.totalCompletedGames > 1 ? "s" : "";
    const withPlural = matchUp.gamesWith > 1 ? "s" : "";
    const againstPlural = matchUp.gamesAgainst > 1 ? "s" : "";
    return (
        <YStack
        >
            <Paragraph
                fontSize={18}
                marginBottom={8}
            >
                Out of {matchUp.query.isFinished ? "" : "the last "}{matchUp.totalCompletedGames} game{totalPlural}
            </Paragraph>
            { hasGamesWith && (
                <>
                    <Paragraph
                        fontSize={18}
                        marginBottom={8}
                    >
                        <Text
                            fontWeight={"bold"}
                        >
                            {" "}{matchUp.winsWith}
                        </Text>
                        <Text
                            fontSize={16}
                        >
                            {" "}({(percentWith * 100).toFixed(0)}%) win{withPlural}
                        </Text>
                        <Text
                            fontWeight={"bold"}
                        >
                            {" "}together
                        </Text>
                        <Text
                        >
                            {" "}out of {matchUp.gamesWith} game{withPlural}
                        </Text>
                    </Paragraph>
                </>
            )}
            { hasGamesAgainst && (
                <>
                    <Paragraph
                        fontSize={18}
                        marginBottom={8}
                    >
                        <Text
                            fontWeight={"bold"}
                        >
                            {" "}{matchUp.winsAgainst}
                        </Text>
                        <Text
                            fontSize={16}
                        >
                            {" "}({(percentAgainst * 100).toFixed(0)}%) win{againstPlural}
                        </Text>
                        <Text
                            fontWeight={"bold"}
                        >
                            {" "}against
                        </Text>
                        <Text
                        >
                            {" "}out of {matchUp.gamesAgainst} game{againstPlural}
                        </Text>
                    </Paragraph>
                </>
            )}
            <Text
                marginTop={8}
                fontSize={20}
                fontWeight={"600"}
                textAlign={"center"}
            >
                {grudgeText}
            </Text>
            { showTapToSeeMore &&
                <Text
                    fontWeight={"bold"}
                    fontSize={14}
                >
                    Tap to see the game{totalPlural}
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
