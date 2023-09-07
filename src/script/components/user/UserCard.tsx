import {Pressable, Text, useColorScheme, View} from "react-native";
import {User} from "../../models/User";


export function UserCard({user, onClick}: {user: User, onClick: ((user: User) => void)|null}) {

    const inner = (
        <Text>
            {user.username}
        </Text>
    );
    if (onClick != null) {
        return (
            <Pressable
                // style={{width: "100%", height: "100%"}}
                onPress={event => onClick(user)}
            >
                {inner}
            </Pressable>
        )
    } else {
        return (
            <View
                // style={{width: "100%", height: "100%"}}
            >
                {inner}
            </View>
        )
    }
}