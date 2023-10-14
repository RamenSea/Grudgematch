import {Button as TButton, ButtonProps as TButtonProps, Text} from 'tamagui'

export type ButtonProps = {
    loading?: boolean,
    title?: string
} & TButtonProps;

export function Button(props: ButtonProps) {
    const { title, loading, ...rest } = props

    return (
        <TButton
            {...rest}
            opacity={rest.disabled ? 0.5 : 1.0}
        >
            {title &&
                <Text
                    fontWeight={"600"}
                    fontSize={16}
                >
                    {title}
                </Text>
            }
        </TButton>
    )
}