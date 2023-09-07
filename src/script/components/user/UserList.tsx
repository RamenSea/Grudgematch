import {User} from "../../models/User";
import {UserCard} from "./UserCard";
import {FlatList} from "react-native";

export function UserList({
                             users,
                             onRequestNextPage,
                             onSelect}: {
    users: User[],
    onRequestNextPage: (() => void)|null,
    onSelect: ((user: User) => void)|null
}) {
    return (
        <FlatList
            style={{width: "100%", height: "100%"}}
            data={users}
            keyExtractor={item => item.aoe4WorldId.toString()}
            onEndReached={info => onRequestNextPage ? onRequestNextPage() : null}
            onEndReachedThreshold={2}
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