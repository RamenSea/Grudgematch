import {SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View} from "react-native";
import React from "react";
import {MainAppViewProps, PossibleRoutePropNames} from "./RootRoute";
import {Colors} from "react-native/Libraries/NewAppScreen";

/**
 * Argument in favor having hierarchical class based views in React Native:
 * I imagine this will be the most controversial decision in the code base. I understand that normal React pushes the
 * user to avoid creating hierarchical class based views. I think that is all well and good when the JS is powering an
 * HTML web page. React Native is not powering an HTML page and is rather powering a native view. In our case it is
 * powering a UIViewController. Creating a base view class for our root views to inherit allows us to create a common
 * layer across the platforms and to fill in where React Native is lacking.
 *
 * I also think it's useful for onboarding on new developers to the React Native platform. Its probably more important
 * the developers we hire have native iOS or Android experience than React Native experience. React Native is considerably
 * easier to pick up compared to the native platforms and the hard bits of React Native is recreating the native experience
 * within the framework. Also, the hard bits can be plugging React Native into the native platforms for example say we
 * are developing a feature that processes images in the background. This might be better written in the platform's native
 * code to enable direct access to ML models and threading support.
 *
 *
 * @class
 *
 * To work with React Native's view system, two generics need to be specified.
 *
 * T: is a string referring to view's name and the name of the field on the property class that holds the views props.
 *      In this case there's only one which is "ImageGrid"
 *
 * S: refers to the view's state object
 */
export abstract class BaseRootView<T extends PossibleRoutePropNames, S> extends React.Component<MainAppViewProps<T>, S>  {

    private focusListener:(() => void)|null = null;
    private blurListener:(() => void)|null = null;

    /**
     * Because of TypeScript's typing system and two generic fields on this view, we easily limit subclasses' `props` and
     * `state` to the right type. Making it easier to update a subclass
     */
    constructor(props: MainAppViewProps<T>) {
        super(props);
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("focus", () => this.onWillAppear());
        this.blurListener = this.props.navigation.addListener("blur", () => this.onWillDisappear());
    }
    componentWillUnmount() {
        if (this.focusListener != null) {
            this.focusListener();
            this.focusListener = null;
        }
        if (this.blurListener != null) {
            this.blurListener();
            this.blurListener = null;
        }
    }

    /**
     * Mirror's UIViewControllers own `onWillAppear`
     * This is a good time to start subscribing to events.
     */
    onWillAppear(){}
    /**
     * Mirror's UIViewControllers own `onWillDisappear`
     * This is a good time to start unsubscribing to events
     * If `LiveData` was a more robust solution, you could have it such that [BaseRootView] always knows to unsubscribe
     * in this method. This helps avoid a lot of memory leak head aches
     */
    onWillDisappear(){}

    /**
     *
     */
    abstract renderView(): React.JSX.Element;

    /**
     * `renderView` and `render` are separate as ideally there would be some standard layout code such as handling
     * rendering on an iPad, displaying dark mode, or inserting a view.
     *
     * In reality however this could be condensed, but I wanted to present a more accurate view of how the class might look
     */
    render() {
        return (
            <View>
                {this.renderView()}
            </View>
        );
    }
}