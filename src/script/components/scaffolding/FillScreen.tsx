import {SafeAreaView, useWindowDimensions, ViewProps} from "react-native";
import React from "react";
import {isWeb} from "tamagui";

export function FillScreen(props:ViewProps) {
    if (isWeb == false) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                }}
            >
                {props.children}
            </SafeAreaView>
        )
    }

    const {height, width} = useWindowDimensions();
    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: width,
                minWidth: width,
                height: height,
                minHeight:height,
                alignContent: "center",
            }}
        >
            {props.children}
        </SafeAreaView>
    )
}