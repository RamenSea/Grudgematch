import {User} from "../../models/User";
import {UserCard} from "./UserCard";
import {FlatList} from "react-native";
import {Spacer, YStack} from "tamagui";
import {useCallback, useState} from "react";

export function UserList({
                         users,
                         onRequestNextPage,
                         onSelect,
                         extraHorizontalPadding}: {
    users: User[],
    onRequestNextPage: (() => void)|null,
    onSelect?: ((user: User) => void),
    extraHorizontalPadding?: number,
}) {
    const usingExtraHorizontalPadding = extraHorizontalPadding ?? 0;

    return (
        <FlatList
            data={users}
            style={{
                overflow: "scroll",
                flex: 1,
            }}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.aoe4WorldId.toString()}
            onEndReached={info => onRequestNextPage ? onRequestNextPage() : null}
            onEndReachedThreshold={0.2}
            renderItem={({item, index, separators}) => {
                return (
                    <YStack
                        paddingVertical={8}
                        paddingHorizontal={8 + usingExtraHorizontalPadding}
                        $gtMd={{
                            paddingHorizontal: 24 + usingExtraHorizontalPadding
                        }}
                    >
                        <UserCard
                            user={item}
                            onClick={onSelect}
                        />
                    </YStack>
                )
            }}
        />
    )
}
