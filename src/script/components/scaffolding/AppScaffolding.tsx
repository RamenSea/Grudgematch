import config from "../../../tamagui.config";
// import {ToastProvider, ToastViewport} from "@tamagui/toast";
import React, {ReactNode} from "react";
import {PortalProvider, TamaguiProvider, Theme} from "tamagui";
import {container} from "../../../inversify.config";
import {Provider} from "inversify-react";
import {useColorScheme} from "react-native";


export function AppScaffolding({children}: {children: ReactNode}) {
    const scheme = useColorScheme();
    const themeName = scheme == "light" ? "light_green" : "dark_green";

    return (
        <TamaguiProvider config={config} defaultTheme={themeName}>
            <PortalProvider>
                {/*<ToastProvider>*/}
                {/*    <ToastViewport*/}
                {/*        flexDirection="column"*/}
                {/*        top={0}*/}
                {/*        width={"100%"}*/}
                {/*        multipleToasts={true}/>*/}
                    <Provider container={container}>
                        {children}
                    </Provider>
                {/*</ToastProvider>*/}
            </PortalProvider>
        </TamaguiProvider>
    )
}