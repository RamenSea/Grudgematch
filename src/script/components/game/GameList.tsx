import {FlatList} from "react-native";
import {Game} from "../../models/Game";
import {GameCard} from "./GameCard";
import {YStack} from "tamagui";
import {UserCard} from "../user/UserCard";

export function GameList({
                             games,
                             onRequestNextPage,
                             onSelect,
                             nestedScrollEnabled,}: {
    games: Game[],
    onRequestNextPage?: (() => void),
    onSelect?: ((game: Game) => void)
    nestedScrollEnabled?: boolean,
}) {
    return (
        <FlatList
            style={{
                overflow: "scroll"
            }}
            nestedScrollEnabled={nestedScrollEnabled}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={games}
            keyExtractor={item => item.id.toString()}
            onEndReached={info => onRequestNextPage ? onRequestNextPage() : null}
            onEndReachedThreshold={0.3}
            renderItem={({item, index, separators}) => {
                return (
                    <YStack
                        paddingLeft={24}
                        paddingRight={24}
                        paddingTop={8}
                        paddingBottom={8}
                        overflow={"visible"}
                    >
                        <GameCard
                            key={item.id}
                            game={item}
                            onClick={onSelect}
                        />
                    </YStack>
                )
            }}
        />
    )
}