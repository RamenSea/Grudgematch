import {Game, Player} from "../../models/Game";
import {FlatList, Text, View} from "react-native";
import {PlayerCard} from "./PlayerCard";


export function GameCard({
                             game,}: {
    game: Game
}) {

    const teams = game.teams;
    return (
        <View>
            <Text>
                {game.isPlaying ? "still going": "done"}
            </Text>

            <FlatList
                data={teams}
                renderItem={info => {
                    return (
                        <GameCardPlayerList
                            players={info.item}
                        />
                    )
                }}
            />
        </View>
    )
}


export function GameCardPlayerList({
    players,
                                   }:{
    players: Player[],
}) {

    return (
        <FlatList
            data={players}
            keyExtractor={item => item.aoe4WorldId.toString()}
            renderItem={info => {
                return (
                    <PlayerCard
                        player={info.item}
                    />
                )
            }}
        />
    )
}