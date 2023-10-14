import {User} from "../../models/User";
import {UserCard} from "./UserCard";
import {FlatList} from "react-native";
import {Spacer} from "tamagui";

export function UserList({
                             users,
                             onRequestNextPage,
                             onSelect}: {
    users: User[],
    onRequestNextPage: (() => void)|null,
    onSelect?: ((user: User) => void)
}) {
    return (
        <FlatList
            data={users}
            style={{
                overflow: "visible",
            }}
            keyExtractor={item => item.aoe4WorldId.toString()}
            onEndReached={info => onRequestNextPage ? onRequestNextPage() : null}
            onEndReachedThreshold={2}
            ItemSeparatorComponent={props => <Spacer height={16}/>}
            renderItem={({item, index, separators}) => {
                return (
                    <UserCard
                        user={item}
                        onClick={onSelect}
                    />
                )
            }}
        />
    )
}