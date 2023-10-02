import {Game, Player} from "../../models/Game";
import {FlatList, Text, View} from "react-native";
import {PlayerCard} from "./PlayerCard";
import {MatchUp} from "../../models/MatchUp";
import {UserCard} from "../user/UserCard";
import {User} from "../../models/User";
import {GameCard} from "./GameCard";
import React from "react";
import {Button} from "@rneui/themed";

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
    const showMoreButton = matchUp.games.length > maxShowGames;
    let winsForMe = 0
    matchUp.games.forEach((value, index) => {
        const myPlayer = value.getPlayerById(against.aoe4WorldId);
        if (myPlayer != null && value.winningTeam == myPlayer.teamId) {
            winsForMe++;
        }
    })

    const gameComponents: JSX.Element[] = [];
    for (let i = 0; i < matchUp.games.length && i < maxShowGames; i++) {
        gameComponents.push((
           <GameCard
               game={matchUp.games[i]}
               onClick={onGameClick}
           />
        ));
    }
    return (
        <View
        >
            <UserCard
                user={matchUp.opponent}
                onClick={onUserClick}
            />
            { showMoreButton &&
                <Button
                    onPress={() => onShowMoreGamesClicked && onShowMoreGamesClicked(matchUp)}
                >
                    Show more {">"}
                </Button>
            }

            <Text>
                games: {winsForMe} / {matchUp.games.length}
            </Text>
            {gameComponents}
            <View
                style={{
                    marginTop: 8,
                    backgroundColor: "#000",
                    height: 4,
                    width: "100%",
                }}
            />
        </View>
    )
}
