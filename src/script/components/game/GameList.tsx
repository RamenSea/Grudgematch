import {FlatList} from "react-native";
import {Game} from "../../models/Game";
import {GameCard} from "./GameCard";
import {YStack} from "tamagui";
import {UserCard} from "../user/UserCard";
import {User} from "../../models/User";

export function GameList({
    user,
                             games,
                             onRequestNextPage,
                             onSelect,
                             nestedScrollEnabled,}: {
    user?: User,
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
                        paddingLeft={8}
                        paddingRight={8}
                        paddingTop={8}
                        paddingBottom={8}
                        overflow={"visible"}
                    >
                        <GameCard
                            user={user}
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