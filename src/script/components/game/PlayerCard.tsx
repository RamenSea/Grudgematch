import {Game, Player} from "../../models/Game";
import {Text, View} from "react-native";

export function PlayerCard({
                             player,}: {
    player: Player
}) {
    return (
        <View>
            <Text>
                {player.username}
            </Text>
        </View>
    )
}