import React from "react";
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";
import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {SetUpView} from "./SetUpView";
import {useColorScheme} from "react-native";
import {AssignUserView, AssignUserViewProps} from "./AssignUserView";
import {UserOverviewView, UserOverviewViewProps} from "./UserOverviewView";
import {SelectUserView, SelectUserViewProps} from "./SelectUserView";
import {SettingsView} from "./SettingsView";
import {GameListView, GameListViewProps} from "./GameListView";
import * as path from "path";


/**
 * Arguments for views, putting this here allows for TypeScript's type system to work
 */
export type RootRouteProps = {
    SetUpView: undefined,
    SelectUserView: SelectUserViewProps,
    AssignUserView: AssignUserViewProps,
    UserOverviewView: UserOverviewViewProps,
    GameListView: GameListViewProps,
    SettingsView: undefined,
};

/**
 * Works with TypeScript's type system to pull the right view props for the right view
 * This is overkill for this project, but if the app was to have 10-30 root views like most apps.
 * Having a routing system that enabled TypeScript's type checking system would eliminate a lot of bugs and help facilitate co-working
 */
export type PossibleRoutePropNames = keyof RootRouteProps;
    // "SetUpView" |
    // "SelectUserView" |
    // "AssignUserView" |
    // "UserOverviewView" |
    // "GameListView" |
    // "SettingsView";

/**
 * A required step to enable RootRouteProps
 */
export type MainAppViewProps<T extends PossibleRoutePropNames> = NativeStackScreenProps<RootRouteProps, T>;

const Stack = createNativeStackNavigator<RootRouteProps>();

/**
 * Our apps main routing system
 * @constructor
 */
export function RootRoute(initialRouteName: {initialRouteName: keyof RootRouteProps }) {
    const scheme = useColorScheme();

    return (
        <NavigationContainer
            linking={{
                enabled: true,
                prefixes: [""],
                config: {
                    screens: {
                        SetUpView: "setup",
                        SelectUserView: "select",
                        AssignUserView: "assign",
                        UserOverviewView: "overview/:username?",
                        SettingsView: "settings",
                    },
                }
            }}
            theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                // @ts-ignore
                initialRouteName={initialRouteName}
            >
                <Stack.Screen
                    name="SetUpView"
                    component={SetUpView}
                    options={{title: 'Set up', headerShown: false}}
                />
                <Stack.Screen
                    name="SelectUserView"
                    component={SelectUserView}
                    getId={(params) => params.params.username }
                    initialParams={{startingUsersToSelect: null}}
                    options={{title: 'Select'}}
                />
                <Stack.Screen
                    name="AssignUserView"
                    component={AssignUserView}
                    getId={(params) => {
                        if (params.params.userId) {
                            return params.params.userId.toString();
                        }
                        if (params.params.username) {
                            return params.params.username;
                        }
                        return "NONE";
                    }}
                    options={{title: 'Select'}}
                />
                <Stack.Screen
                    name="UserOverviewView"
                    component={UserOverviewView}
                    getId={(params) => {
                        if (params.params.username) {
                            return "u_" + params.params.username;
                        }
                        return "ME";
                    }}
                    options={{title: 'User'}}
                />
                <Stack.Screen
                    name="GameListView"
                    component={GameListView}
                    getId={(params) => {
                        return "TODO";
                    }}
                    options={{title: 'Games'}}
                />
                <Stack.Screen
                    name="SettingsView"
                    component={SettingsView}
                    options={{title: 'Settings'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}