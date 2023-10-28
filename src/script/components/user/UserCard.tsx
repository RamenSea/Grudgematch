import {Pressable, View} from "react-native";
import {Rank, User} from "../../models/User";
import {RankIcon} from "../game/RankIcon";
import React from "react";
import {Image, Card, Text, XStack, Spacer, YStack, Square} from "tamagui";
import {SelectableCard} from "../scaffolding/SelectableCard";


export function UserCardInsides(
    {
        user,
    }: {
        user: User,
    }) {
    const rankedRowHeight = 42;
    const iconSize = 28;
    const ratingLineHeight = 22;
    const profileImageSize = 64;
    const fontSize = 16;
    const qmRating = user.averageRecentQMRating(true);

    let quickMatchView: React.JSX.Element|undefined = undefined;
    if (qmRating > 0) {
        quickMatchView = (
            <Text
                fontSize={fontSize}
            >
                QM: {qmRating}
            </Text>
        );
    }
    let soloRankView: React.JSX.Element|undefined = undefined;
    const soloRank = user.recentRank(true);
    if (soloRank != Rank.NONE && soloRank != Rank.UNRANKED) {
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
                    fontSize={fontSize}
                >
                    {soloRating}
                </Text>
            </>
        );
    }

    let teamRankView: React.JSX.Element|undefined = undefined;
    const teamRank = user.recentRank(false);
    if (teamRank != Rank.NONE && teamRank != Rank.UNRANKED) {
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
                    fontSize={fontSize}
                >
                    {teamRating}
                </Text>
            </>
        );
    }

    return (
        <XStack>
            { user.mediumAvatarImageUrl &&
                <Image
                    source={{
                        uri: user.mediumAvatarImageUrl,
                    }}
                    borderRadius={4}
                    width={profileImageSize}
                    height={profileImageSize}
                    backgroundColor={"rgba(131,131,131,0.38)"}
                />
            }
            { !user.mediumAvatarImageUrl &&
                <Square
                    borderRadius={4}
                    width={profileImageSize}
                    height={profileImageSize}
                    backgroundColor={"rgba(131,131,131,0.38)"}
                />
            }
            <YStack
                marginLeft={8}
            >
                <Text
                    fontSize={18}
                    marginTop={0}
                    fontWeight={"600"}
                    marginBottom={"auto"}
                >
                    {user.username}
                </Text>
                <XStack
                    height={rankedRowHeight}
                    alignContent={"flex-end"}
                    alignItems={"flex-end"}
                    marginTop={"auto"}
                    marginBottom={0}
                >
                    {quickMatchView}
                    {soloRankView}
                    {teamRankView}
                </XStack>
            </YStack>
        </XStack>
    )
}
export function UserCard(
    {
        user,
        onClick
    }: {
        user: User,
        onClick?: ((user: User) => void)
    }) {

    if (onClick) {
        return (
            <SelectableCard
                bordered
                onPress={(e) => onClick(user)}
            >
                <UserCardInsides
                    user={user}
                />
            </SelectableCard>
        )
    }
    return (
        <Card
            padded
            bordered
            elevation={30}
        >
            <UserCardInsides
                user={user}
            />
        </Card>
    );
}