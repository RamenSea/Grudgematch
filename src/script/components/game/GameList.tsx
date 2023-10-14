import {FlatList} from "react-native";
import {Game} from "../../models/Game";
import {GameCard} from "./GameCard";

export function GameList({
                             games,
                             onRequestNextPage,
                             onSelect}: {
    games: Game[],
    onRequestNextPage?: (() => void),
    onSelect?: ((game: Game) => void)
}) {
    return (
        <FlatList
            style={{width: "100%", height: "100%"}}
            data={games}
            keyExtractor={item => item.id.toString()}
            // onEndReached={info => console.log(info.distanceFromEnd)}
            // onEndReachedThreshold={0.3}
            renderItem={({item, index, separators}) => {
                return (
                    <GameCard
                        key={item.id}
                        game={item}
                        onClick={onSelect}
                    />
                )
            }}
        />
    )
}