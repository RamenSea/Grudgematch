import {H2, isWeb, Text, XStack} from "tamagui";
import React from "react";
import {View} from "react-native";


export function WebHeader({
    title
                          }:{
    title: string
}) {
    if (isWeb == false) {
        return <View/>
    }

    const hasTitle = title.length > 0;
    return (
        <XStack
            height={hasTitle ? 64 : 24}
            alignItems={"center"}
        >
            <H2
                textAlign={"center"}
                marginLeft={"auto"}
                marginRight={"auto"}
            >
                {title}
            </H2>

        </XStack>
    )
}