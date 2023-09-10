import React from "react";
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";
import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {SetUpView} from "./SetUpView";
import {useColorScheme} from "react-native";
import {BootView} from "./BootView";
import {AssignUserView, AssignUserViewProps} from "./AssignUserView";
import {UserOverviewView, UserOverviewViewProps} from "./UserOverviewView";
import {SelectUserView, SelectUserViewProps} from "./SelectUserView";
import {SettingsView} from "./SettingsView";


/**
 * Arguments for views, putting this here allows for TypeScript's type system to work
 */
export type RootRouteProps = {
    BootView: undefined,
    SetUpView: undefined,
    SelectUserView: SelectUserViewProps,
    AssignUserView: AssignUserViewProps,
    UserOverviewView: UserOverviewViewProps,
    SettingsView: undefined,
};

/**
 * Works with TypeScript's type system to pull the right view props for the right view
 * This is overkill for this project, but if the app was to have 10-30 root views like most apps.
 * Having a routing system that enabled TypeScript's type checking system would eliminate a lot of bugs and help facilitate co-working
 */
export type PossibleRoutePropNames =
    "BootView" |
    "SetUpView" |
    "SelectUserView" |
    "AssignUserView" |
    "UserOverviewView" |
    "SettingsView";

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
                    name="SelectUserView"
                    component={SelectUserView}
                    getId={(params) => params.params.username }
                    initialParams={{startingUsersToSelect: null}}
                    options={{title: 'Select'}}
                />
                <Stack.Screen
                    name="AssignUserView"
                    component={AssignUserView}
                    getId={(params) => params.params.user.aoe4WorldId.toString() }
                    options={{title: 'Select'}}
                />
                <Stack.Screen
                    name="UserOverviewView"
                    component={UserOverviewView}
                    getId={(params) => {
                        if (params.params?.selectedUser != null) {
                            return "s_" + params.params.selectedUser.aoe4WorldId.toString();
                        }
                        return "ME";
                    }}
                    initialParams={{selectedUser: null}}
                    options={{title: 'User'}}
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