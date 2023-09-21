import {Game, Player} from "../../models/Game";
import {FlatList, Pressable, Text, View} from "react-native";
import {PlayerCard} from "./PlayerCard";
import {CivilizationFlag} from "./CivilizationFlag";
import {Card} from "@rneui/base";


export function GameCard({
                             game,
                             onClick,
                         }: {
                            game: Game
                            onClick?: (game: Game) => void,
                        }) {

    const teams = game.teams;

    const inner = (
        <Card
        >
            <Text>
                Game is: {game.isPlaying ? "still going": "complete"}
            </Text>

            <FlatList
                data={teams}
                horizontal={true}
                keyExtractor={item => item.teamNumber.toString()}
                renderItem={info => {
                    return (
                        <GameCardPlayerList
                            teamNumber={info.item.teamNumber}
                            players={info.item.players}
                        />
                    )
                }}
            />
        </Card>
    );
    if (onClick) {
        return (
            <Pressable
                style={{
                }}
                onPress={event => onClick(game)}
            >
                {inner}
            </Pressable>
        )
    }
    return inner;
}


export function GameCardPlayerList({
    teamNumber,
    players,
                                   }:{
    teamNumber: number,
    players: Player[],
}) {

    const playerList = players.map(player => {
        return (
            <View
                key={player.aoe4WorldId}
                style={{
                    flexDirection: "row",
                }}
            >
                <CivilizationFlag width={24} height={24} civilization={player.civilization}/>
                <Text>
                     {player.username}
                </Text>
            </View>
        )
    });
    return (
        <View>
            <Text>
                Team {teamNumber}:
            </Text>
            {playerList}
        </View>
    )
}