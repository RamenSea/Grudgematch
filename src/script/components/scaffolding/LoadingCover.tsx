import {H4, YStack} from "tamagui";
import {ThemedSpinner} from "./ThemedSpinner";
import React from "react";

export function LoadingCover({
    message,
    isHidden,
    width,
    height,
                             }:{
    message?: string,
    isHidden?: boolean,
    width?: number|string,
    height?: number|string,

}) {


    return (
        <YStack
            alignContent={"center"}
            alignItems={"center"}
            width={width}
            height={height}
            display={isHidden ? "none" : "flex"}
        >
            <H4
                marginTop={"auto"}
                marginLeft={"auto"}
                marginRight={"auto"}
                marginBottom={16}
                textAlign={"center"}
            >
                {message ?? "Loading"}...
            </H4>
            <ThemedSpinner
                size={"large"}
                marginBottom={"auto"}
                marginLeft={"auto"}
                marginRight={"auto"}
            />
        </YStack>
    )
}