import React from "react";
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";
import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {SetUpView} from "./SetUpView";
import {useColorScheme} from "react-native";
import {BootView} from "./BootView";
import {AssignUserView, AssignUserViewProps} from "./AssignUserView";


/**
 * Arguments for views, putting this here allows for TypeScript's type system to work
 */
export type RootRouteProps = {
    BootView: undefined,
    SetUpView: undefined,
    AssignUserView: AssignUserViewProps,
};

/**
 * Works with TypeScript's type system to pull the right view props for the right view
 * This is overkill for this project, but if the app was to have 10-30 root views like most apps.
 * Having a routing system that enabled TypeScript's type checking system would eliminate a lot of bugs and help facilitate co-working
 */
export type PossibleRoutePropNames = "BootView" | "SetUpView" | "AssignUserView";

/**
 * A required step to enable RootRouteProps
 */
export type MainAppViewProps<T extends PossibleRoutePropNames> = NativeStackScreenProps<RootRouteProps, T>;

const Stack = createNativeStackNavigator<RootRouteProps>();

/**
 * Our apps main routing system
 * @constructor
 */
export function RootRoute() {
    const scheme = useColorScheme();

    return (
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName="BootView">
                <Stack.Screen
                    name="BootView"
                    component={BootView}
                    options={{title: "", headerShown: false}}
                />
                <Stack.Screen
                    name="SetUpView"
                    component={SetUpView}
                    options={{title: 'Set up'}}
                />
                <Stack.Screen
                    name="AssignUserView"
                    component={AssignUserView}
                    getId={(params) => {
                        if (params.params?.exactUser != null) {
                            return "exact_" + params.params.exactUser.username;
                        } else if (params.params.username != null) {
                            return params.params.username;
                        }
                        return "NONE";
                    }}
                    options={{title: 'Select'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}