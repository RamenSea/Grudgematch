import {SafeAreaView, StyleProp, useWindowDimensions, ViewProps, ViewStyle} from "react-native";
import React from "react";
import {isWeb, Spacer, useTheme, YStack} from "tamagui";

export function AppScreen(props:ViewProps & {
    addHeaderBackground: boolean,
    webWidth: (width: number) => number,
    webMaxHeight: (height: number) => number,
}) {
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

    const windowSize = useWindowDimensions();
    const maxHeight = props.webMaxHeight(windowSize.height);
    const webWidth= props.webWidth(windowSize.width);

    const innerViewStyle: StyleProp<ViewStyle> = {
        flex: 1,
        marginLeft: "auto",
        marginRight: "auto",
        height: windowSize.height,
        width: windowSize.width,
    }
    if (maxHeight > 0) {
        innerViewStyle.maxHeight = maxHeight;
    }
    if (windowSize.width > webWidth) {
        const sidePadding = (windowSize.width - webWidth) / 2;
        innerViewStyle.paddingLeft = sidePadding;
        innerViewStyle.paddingRight = sidePadding;
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

            <YStack
                style={innerViewStyle}
            >
                {props.children}
            </YStack>
        </SafeAreaView>
    )
}
