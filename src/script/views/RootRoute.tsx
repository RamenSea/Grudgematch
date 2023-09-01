import React from "react";
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {LoginView} from "./LoginView";


/**
 * Arguments for views, putting this here allows for TypeScript's type system to work
 */
export type RootRouteProps = {
    LoginView: undefined,
};

/**
 * Works with TypeScript's type system to pull the right view props for the right view
 * This is overkill for this project, but if the app was to have 10-30 root views like most apps.
 * Having a routing system that enabled TypeScript's type checking system would eliminate a lot of bugs and help facilitate co-working
 */
export type PossibleRoutePropNames = "LoginView";

/**
 * A required step to enable RootRouteProps
 */
export type MainAppViewProps<T extends PossibleRoutePropNames> = NativeStackScreenProps<RootRouteProps, T>;

const Stack = createNativeStackNavigator<RootRouteProps>();

/**
 * Our apps main routing system
 * As there is only one view
 * @constructor
 */
export function RootRoute() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginView">
                <Stack.Screen
                    name="LoginView"
                    component={LoginView}
                    options={{title: 'Login'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}