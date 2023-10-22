
import {Card, GetProps} from "tamagui";


export type StandardCardProps = {

} & GetProps<typeof Card>;
export function StandardCard(props: StandardCardProps) {

    const {
        ...rest
    } = props
    return (
        <Card
            padded
            elevate
            {...rest}
        >

        </Card>
    )
}
