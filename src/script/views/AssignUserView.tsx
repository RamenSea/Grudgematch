import {BaseRootView} from "./BaseRootView";
import React from "react";
import {User} from "../models/User";
import {View} from "react-native";
import {AOE4WorldUserQuery} from "../queries/aoe4users/AOE4WorldUserQuery";

export type AssignUserViewProps = {
    exactUser: User| null;
    username: string;
    query: AOE4WorldUserQuery|null;
}
class AssignUserViewState {
}
export class AssignUserView extends BaseRootView<"AssignUserView", AssignUserViewState> {
    renderView(): React.JSX.Element {
        return (
            <View/>
        );
    }


}