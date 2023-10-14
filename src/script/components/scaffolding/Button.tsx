import {Button as TButton, ButtonProps as TButtonProps, Spinner, Stack, Text, useTheme, YStack, ZStack} from 'tamagui'
import {ThemedSpinner} from "./ThemedSpinner";

export type ButtonProps = {
    loading?: boolean,
    large?: boolean,
    title?: string
};

export function Button(props: ButtonProps & TButtonProps) {
    const {
        title,
        large,
        loading,
        ...rest
    } = props

    return (
        <TButton
            {...rest}
            opacity={rest.disabled ? 0.5 : 1.0}
            minHeight={large ? 160 : undefined}
        >
            <ZStack
                width={"100%"}
                height={"100%"}
            >
                {title &&
                    <Text
                        fontWeight={"bold"}
                        fontSize={large ? 32 : 16}
                        opacity={loading ? 0.0 : 1.0}
                        letterSpacing={large ? 16.0 : 1.0}
                        margin={"auto"}
                    >
                        {title}
                    </Text>
                }
                {loading &&
                    <ThemedSpinner
                        size={large ? "large" : "small"}
                        margin={"auto"}
                    />
                }
            </ZStack>
        </TButton>
    )
}