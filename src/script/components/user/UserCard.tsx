import {Pressable, View} from "react-native";
import {Rank, User} from "../../models/User";
import {RankIcon} from "../game/RankIcon";
import React from "react";
import {Image, Card, Text, XStack, Spacer, YStack} from "tamagui";
import {SelectableCard} from "../scaffolding/SelectableCard";


export function UserCard(
    {
        user,
        onClick
    }: {
        user: User,
        onClick?: ((user: User) => void)
    }) {
    const rankedRowHeight = 42;
    const iconSize = 32;
    const ratingLineHeight = 22;
    const profileImageSize = 42;
    const qmRating = user.averageRecentQMRating(true);

    let quickMatchView: React.JSX.Element|undefined = undefined;
    if (qmRating > 0) {
        quickMatchView = (
            <Text
            >
                QM: {qmRating}
            </Text>
        );
    }
    let soloRankView: React.JSX.Element|undefined = undefined;
    const soloRank = user.recentRank(true);
    if (soloRank != Rank.NONE) {
        const soloRating = user.recentRating(true);
        soloRankView = (
            <>
                <RankIcon
                    rank={soloRank}
                    isSolo={true}
                    width={iconSize}
                    height={iconSize}
                />
                <Text
                >
                    {soloRating}
                </Text>
            </>
        );
    }

    let teamRankView: React.JSX.Element|undefined = undefined;
    const teamRank = user.recentRank(false);
    if (teamRank != Rank.NONE) {
        const teamRating = user.recentRating(false);
        teamRankView = (
            <>
                <RankIcon
                    rank={teamRank}
                    isSolo={false}
                    width={iconSize}
                    height={iconSize}
                />
                <Text
                >
                    {teamRating}
                </Text>
            </>
        );
    }

    const body = (
        <YStack>
            <XStack
                style={{
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                }}>
                <Image
                    source={{
                        uri: user.mediumAvatarImageUrl,
                    }}
                    borderRadius={4}
                    style={{
                        width: profileImageSize,
                        height: profileImageSize,
                        backgroundColor: "rgba(131,131,131,0.38)",
                    }}
                />
                <Spacer
                    width={8}
                    height={1}
                />
                <Text
                    fontSize={18}
                >
                    {user.username}
                </Text>

            </XStack>
            <XStack
                height={rankedRowHeight}
                alignContent={"center"}
                alignItems={"center"}
            >
                {quickMatchView}
                {soloRankView}
                {teamRankView}
            </XStack>
        </YStack>
    )
    if (onClick) {
        return (
            <SelectableCard
                bordered
                onPress={(e) => onClick(user)}
            >
                {body}
            </SelectableCard>
        )
    }
    return (
        <Card
            padded
            bordered
            elevation={30}
        >
            {body}
        </Card>
    );
}