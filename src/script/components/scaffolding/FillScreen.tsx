import {SafeAreaView, useWindowDimensions, ViewProps} from "react-native";
import React from "react";
import {isWeb, Spacer, useTheme} from "tamagui";

export function FillScreen(props:ViewProps & {addHeaderBackground: boolean}) {
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
    const theme = useTheme()
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
            { props.addHeaderBackground &&
                <Spacer
                    position={"absolute"}
                    left={0}
                    right={0}
                    top={0}
                    width={width}
                    height={"$webHeader.height"}
                    backgroundColor={"$color2"}
                />
            }
            {props.children}
        </SafeAreaView>
    )
}