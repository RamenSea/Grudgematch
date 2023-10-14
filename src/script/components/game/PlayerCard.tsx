import {Player} from "../../models/Game";
import {View} from "react-native";
import {Text} from "tamagui";

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