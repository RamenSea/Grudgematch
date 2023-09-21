import {Game, Player} from "../../models/Game";
import {FlatList, Text, View} from "react-native";
import {PlayerCard} from "./PlayerCard";
import {MatchUp} from "../../models/MatchUp";
import {UserCard} from "../user/UserCard";
import {User} from "../../models/User";
import {GameCard} from "./GameCard";
import React from "react";

export function MatchUpCard({   against,
                                matchUp,
                                onUserClick,
                                onGameClick,
                                onShowMoreGamesClicked}: {
    against: User,
    matchUp: MatchUp,
    onUserClick?: (user: User) => void,
    onGameClick?: (game: Game) => void,
    onShowMoreGamesClicked?: (matchUp: MatchUp) => void,
}) {
    const maxShowGames = 3;
    let winsForMe = 0
    matchUp.games.forEach((value, index) => {
        const myPlayer = value.getPlayerById(against.aoe4WorldId);
        if (myPlayer != null && value.winningTeam == myPlayer.teamId) {
            winsForMe++;
        }
    })

    let games
    return (
        <View>
            <UserCard
                user={matchUp.opponent}
                onClick={onUserClick}
            />

            <Text>
                games: {winsForMe} / {matchUp.games.length}
            </Text>
            <FlatList
                style={{
                    maxHeight: 300,
                }}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={true}
                data={matchUp.games}
                renderItem={info => {
                    return (
                        <GameCard
                            game={info.item}
                            onClick={onGameClick}
                        />
                    )
                }}
            />
            <View
                style={{
                    backgroundColor: "#000",
                    height: 1,
                    width: "100%",
                }}
            />
        </View>
    )
}
