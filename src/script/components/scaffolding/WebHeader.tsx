import {H2, isWeb, Text, XStack} from "tamagui";
import React from "react";
import {Dimensions, View} from "react-native";
import {Button, ButtonProps} from "./Button";


export function WebHeader({
    title,
    rightButtonProps,
                          }:{
    title: string,
    rightButtonProps?: ButtonProps,
}) {
    if (isWeb == false) {
        return null
    }
    const hasTitle = title.length > 0;

    return (
        <XStack
            height={hasTitle ? "$webHeader.height" : 24}
            paddingLeft={24}
            paddingRight={24}
            alignItems={"center"}
            backgroundColor={ hasTitle ? "$color2": undefined}
        >
            <H2
                textAlign={"center"}
                width={"100%"}
                marginTop={"auto"}
                marginBottom={"auto"}
            >
                {title}
            </H2>
            { rightButtonProps &&
                (
                    <Button
                        right={24}
                        position={"absolute"}
                        unstyled={true}
                        color={"$color10"}
                        fontSize={14}
                        {...rightButtonProps}
                    />
                )
            }

        </XStack>
    )
}
