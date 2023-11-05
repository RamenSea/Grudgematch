import config from "../../../tamagui.config";
import React, {ReactNode} from "react";
import {PortalProvider, TamaguiProvider, Theme} from "tamagui";
import {container} from "../../../inversify.config";
import {Provider} from "inversify-react";
import {useColorScheme} from "react-native";
import {ToastProvider, ToastViewport} from "@tamagui/toast";
import {SimpleToast} from "./SimpleToast";
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {HookDependencyProvider} from "./HookDependencyProvider";
import {ToastService} from "../../services/ToastService";


export function AppScaffolding({toastService, children}: { toastService: ToastService, children: ReactNode }) {
    const scheme = useColorScheme();
    const themeName = scheme == "light" ? "light_green" : "dark_green";
    const {left, top, right} = useSafeAreaInsets()

    const toastOffset = Math.max(8, top)
    return (
        <TamaguiProvider config={config} defaultTheme={themeName}>
            <PortalProvider>
                <ToastProvider>
                    <ToastViewport
                        flexDirection="column"
                        width={"100%"}
                        multipleToasts={true}
                        top={toastOffset}
                        left={left}
                        right={right}
                    />
                    <SimpleToast/>
                    <Provider container={container}>
                        <HookDependencyProvider
                            onUpdate={(toastController) => {
                                toastService.set(toastController);
                            }}
                        />
                        {children}
                    </Provider>
                </ToastProvider>
            </PortalProvider>
    </TamaguiProvider>
    )
}