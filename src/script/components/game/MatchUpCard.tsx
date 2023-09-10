import {Game, Player} from "../../models/Game";
import {FlatList, Text, View} from "react-native";
import {PlayerCard} from "./PlayerCard";
import {MatchUp} from "../../models/MatchUp";
import {UserCard} from "../user/UserCard";

export function MatchUpCard({
                                matchUp,}: {
    matchUp: MatchUp
}) {

    return (
        <View>
            <Text>
                Opponent:
            </Text>
            <UserCard
                user={matchUp.opponent}
                onClick={null}
                      />

            <Text>
                games: {matchUp.games.length}
            </Text>

        </View>
    )
}
