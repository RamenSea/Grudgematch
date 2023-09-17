import {Image, Pressable, Text, View} from "react-native";
import {Rank, User} from "../../models/User";
import {RankIcon} from "../game/RankIcon";
import {Card} from "@rneui/base";
import React from "react";


export function UserCard({user, onClick}: {user: User, onClick: ((user: User) => void)|null}) {
    const rankedRowHeight = 42;
    const iconSize = 32;
    const ratingLineHeight = 22;
    const qmRating = user.averageRecentQMRating(true);

    let soloRankView: React.JSX.Element;
    const soloRank = user.recentRank(true);
    if (soloRank == Rank.NONE) {
        soloRankView = (<View/>);
    } else {
        const soloRating = user.recentRating(true);
        soloRankView = (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: rankedRowHeight,
                }}
            >
                <RankIcon
                    rank={soloRank}
                    isSolo={true}
                    width={iconSize}
                    height={iconSize}
                />
                <Text
                    style={{
                        textAlign: "left",
                        lineHeight: ratingLineHeight,
                    }}
                >
                    {soloRating}
                </Text>
            </View>
        );
    }

    let teamRankView: React.JSX.Element;
    const teamRank = user.recentRank(false);
    if (teamRank == Rank.NONE) {
        teamRankView = (<View/>);
    } else {
        const teamRating = user.recentRating(false);
        teamRankView = (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: rankedRowHeight,
                }}
            >
                <RankIcon
                    rank={teamRank}
                    isSolo={false}
                    width={iconSize}
                    height={iconSize}
                />
                <Text
                    style={{
                        textAlign: "left",
                        lineHeight: ratingLineHeight,
                        color: "#000",
                    }}
                >
                    {teamRating}
                </Text>
            </View>
        );
    }

    const inner = (
        <Card
        >
            <Card.Title

            >
                <View
                    style={{
                        alignContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                    }}>
                    <Image
                        source={{
                            uri: user.smallAvatarImageUrl,
                        }}
                        style={{
                            width: 24,
                            height: 24,
                            backgroundColor: "rgba(131,131,131,0.38)",
                        }}
                    />
                    <View
                        style={{
                            width: 8,
                            height: 1,
                        }}
                    />
                    <Text
                        style={{
                            textAlign: "left",
                        }}
                    >
                        {user.username}
                    </Text>

                </View>
            </Card.Title>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    height: rankedRowHeight,
                }}
            >

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: rankedRowHeight,
                    }}
                >
                    <Text
                        style={{
                            textAlign: "left",
                        }}
                    >
                        QM: {qmRating}
                    </Text>
                </View>
                {soloRankView}
                {teamRankView}
            </View>
        </Card>
    );
    if (onClick != null) {
        return (
            <Pressable
                // style={{width: "100%", height: "100%"}}
                onPress={event => onClick(user)}
            >
                {inner}
            </Pressable>
        )
    } else {
        return (
            <View
                // style={{width: "100%", height: "100%"}}
            >
                {inner}
            </View>
        )
    }
}