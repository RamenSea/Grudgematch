import {
    Button as TButton,
    ButtonProps as TButtonProps,
    Text,
    ZStack
} from 'tamagui'
import {ThemedSpinner} from "./ThemedSpinner";
import {Dimensions} from "react-native";

export type ButtonProps = {
    loading?: boolean,
    large?: boolean,
    dangerous?: boolean,
    removeRoundEdgeOnMobile?: boolean,
    title?: string
} & TButtonProps;

export function Button(props: ButtonProps) {
    const {
        title,
        large,
        loading,
        dangerous,
        removeRoundEdgeOnMobile,
        theme,
        color,
        ...rest
    } = props

    let themeToUse = theme ?? "button";
    if (!theme && dangerous) {
        themeToUse = "red_active";
    }

    let borderRadius: number|undefined = undefined;
    if (removeRoundEdgeOnMobile) {
        const windowWidth = Dimensions.get('window').width;
        if (windowWidth <= 768) { //TODO formalize mobile vs desktop detection
            borderRadius = 0
        }
    }

    return (
        <TButton
            {...rest}
            theme={themeToUse}
            opacity={rest.disabled ? 0.5 : 1.0}
            minHeight={large ? 160 : undefined}
            borderRadius={borderRadius}
        >
            {title &&
                <Text
                    fontWeight={"bold"}
                    fontSize={large ? 32 : 16}
                    opacity={loading ? 0.0 : 1.0}
                    letterSpacing={large ? 16.0 : 1.0}
                    margin={"auto"}
                    color={ color ? color : undefined}
                >
                    {title}
                </Text>
            }
            {loading &&
                <ZStack
                    width={"100%"}
                    height={"100%"}
                    position={"absolute"}
                >
                        <ThemedSpinner
                            size={large ? "large" : "small"}
                            margin={"auto"}
                        />
                </ZStack>
            }
        </TButton>
    )
}