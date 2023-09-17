import {Pressable, Text, useColorScheme, View} from "react-native";
import {User} from "../../models/User";
import {RankIcon} from "../game/RankIcon";
import {Card} from "@rneui/base";


export function UserCard({user, onClick}: {user: User, onClick: ((user: User) => void)|null}) {

    const soloRank = user.recentRank(true);
    const teamRank = user.recentRank(false);
    const inner = (
        <Card

        >
            <Card.Title
            >
                <Text
                    style={{
                        textAlign: "left",
                        lineHeight:16,
                    }}
                >
                    {user.username}
                </Text>
                <RankIcon
                    rank={soloRank}
                    isSolo={true}
                    width={24}
                    height={24}
                />
                <RankIcon
                    rank={teamRank}
                    isSolo={false}
                    width={24}
                    height={24}
                />
            </Card.Title>
        </Card>
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