import {LayoutChangeEvent, Pressable, View} from "react-native";
import {Rank, User} from "../../models/User";
import {RankIcon} from "../game/RankIcon";
import React from "react";
import {Image, Card, Text, XStack, Spacer, YStack, Square, H4} from "tamagui";
import {SelectableCard} from "../scaffolding/SelectableCard";
import {ThemedSpinner} from "../scaffolding/ThemedSpinner";


export function UserCardInsides(
    {
        user,
        emptyMessage,
    }: {
        user: User|null,
        emptyMessage?: string,
    }) {

    const rankedRowHeight = 42;
    const iconSize = 28;
    const ratingLineHeight = 22;
    const profileImageSize = 64;
    const fontSize = 16;

    if (user == null) {
        if (emptyMessage) {
            return (
                <YStack
                    height={profileImageSize}
                    flex={1}
                    alignItems={"center"}
                >
                    <Text
                        marginTop={"auto"}
                        marginBottom={"auto"}
                        fontSize={20}
                        fontWeight={"600"}
                    >
                        {emptyMessage}
                    </Text>
                </YStack>
            )
        }
        return (
            <YStack
                height={profileImageSize}
                flex={1}
                alignItems={"center"}
            >
                <ThemedSpinner
                    marginTop={"auto"}
                    marginBottom={3}
                />
                <Text
                    fontSize={20}
                    fontWeight={"400"}
                    marginTop={3}
                    marginBottom={"auto"}
                >
                    Loading in the user
                </Text>
            </YStack>
        )
    }


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
        onClick,
        onClickEmpty,
        emptyMessage,
        onLayout,
    }: {
        user: User|null,
        onClick?: ((user: User) => void)
        onClickEmpty?: (() => void)
        emptyMessage?: string,
        onLayout?: (layout: LayoutChangeEvent) => void,
    }) {

    const minWidth = 300
    const minHeight = 92

    if (onClick || onClickEmpty) {
        return (
            <SelectableCard
                onLayout={onLayout}
                bordered
                minWidth={minWidth}
                minHeight={minHeight}
                onPress={(e) => {
                    if (user && onClick) {
                        onClick(user)
                    } else if (user == null && onClickEmpty) {
                        onClickEmpty()
                    }
                }}
            >
                <UserCardInsides
                    user={user}
                    emptyMessage={emptyMessage}
                />
            </SelectableCard>
        )
    }
    return (
        <Card
            onLayout={onLayout}
            padded
            bordered
            minWidth={minWidth}
            elevation={30}
        >
            <UserCardInsides
                user={user}
                emptyMessage={emptyMessage}
            />
        </Card>
    );
}