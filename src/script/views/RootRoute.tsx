import React, {ReactNode} from "react";
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";
import {DarkTheme, DefaultTheme, getPathFromState, NavigationContainer} from "@react-navigation/native";
import {SetUpView} from "./SetUpView";
import {useColorScheme} from "react-native";
import {AssignUserView, AssignUserViewProps} from "./AssignUserView";
import {UserOverviewView, UserOverviewViewProps} from "./UserOverviewView";
import {SelectUserView, SelectUserViewProps} from "./SelectUserView";
import {SettingsView} from "./SettingsView";
import {GameListView, GameListViewProps} from "./GameListView";
import {GrudgeView, GrudgeViewProps} from "./GrudgeView";


/**
 * Arguments for views, putting this here allows for TypeScript's type system to work
 */
export type RootRouteProps = {
    SetUpView: undefined,
    SelectUserView: SelectUserViewProps,
    AssignUserView: AssignUserViewProps,
    UserOverviewView: UserOverviewViewProps,
    RootScreen: UserOverviewViewProps,
    GameListView: GameListViewProps,
    SettingsView: undefined,
    GrudgeView: GrudgeViewProps,
};

/**
 * Works with TypeScript's type system to pull the right view props for the right view
 * This is overkill for this project, but if the app was to have 10-30 root views like most apps.
 * Having a routing system that enabled TypeScript's type checking system would eliminate a lot of bugs and help facilitate co-working
 */
export type PossibleRoutePropNames = keyof RootRouteProps;

/**
 * A required step to enable RootRouteProps
 */
export type MainAppViewProps<T extends PossibleRoutePropNames> = NativeStackScreenProps<RootRouteProps, T>;

const Stack = createNativeStackNavigator<RootRouteProps>();

/**
 * Our apps main routing system
 * @constructor
 */
export function RootRoute({
                          }: {
}) {
    const scheme = useColorScheme();

    let rootScreen: ReactNode
    return (
        <NavigationContainer
            theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
            linking={{
                enabled: true,
                prefixes: [
                    "http://localhost:3000",
                    'https://grudgematch.games',
                    'http://grudgematch.games',
                    'https://www.grudgematch.games',
                    'http://www.grudgematch.games',
                ],
                config: {
                    screens: {
                        UserOverviewView: "",
                        SetUpView: "welcome",
                        SelectUserView: "select",
                        AssignUserView: "assign",
                        SettingsView: "settings",
                        GameListView: "games",
                        GrudgeView: "grudge",
                    },
                },
                getPathFromState: (state, options) => {
                    const cleanState = {
                        ...state,
                        routes: state.routes.map(route => {
                            if(!route.params) {
                                return route
                            }

                            const cleanParams: any = {}
                            for(const param in route.params) {
                                // @ts-ignore
                                const value: any = route.params[param]
                                if(value && typeof value !== "object" && typeof value !== "function") {
                                    cleanParams[param] = value
                                }
                            }
                            return {
                                ...route,
                                params: cleanParams,
                            }
                        }),
                    }
                    // @ts-ignore
                    return getPathFromState(cleanState, options) //imported from @react-navigation/native
                },
            }}
            >
            <Stack.Navigator
            >
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
                    name="SetUpView"
                    component={SetUpView}
                    options={{ title: "", headerShown: false}}
                />
                <Stack.Screen
                    name="SelectUserView"
                    component={SelectUserView}
                    getId={(params) => params.params.username }
                    options={{title: 'Select user'}}
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
                    options={{title: 'Assign'}}
                />
                <Stack.Screen
                    name="GameListView"
                    component={GameListView}
                    getId={(params) => {
                        return params.params.q;
                    }}
                    options={{title: 'Games'}}
                />
                <Stack.Screen
                    name="SettingsView"
                    component={SettingsView}
                    options={{title: 'Settings'}}
                />
                <Stack.Screen
                    name="GrudgeView"
                    component={GrudgeView}
                    options={{title: 'Grudge'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}