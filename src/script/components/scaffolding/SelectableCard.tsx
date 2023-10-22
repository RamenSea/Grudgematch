
import {Card, GetProps, styled} from "tamagui";
import {Pressable} from "react-native";
import {StandardCard, StandardCardProps} from "./StandardCard";


type SelectableCardProps = {
        isSelected?: boolean
} & StandardCardProps;
export function SelectableCard(props: SelectableCardProps) {

        const {
                isSelected,
                elevation,
                ...rest
        } = props


        return (
            <StandardCard
                animation={"quick"}
                elevation={5}
                hoverStyle={{ scale: 1.03, elevation: 25 }}
                pressStyle={{ scale: 0.97, elevation: 15 }}
                borderWidth={isSelected ? 2 : undefined}
                borderColor={isSelected ? "$color10" : undefined}
                backgroundColor={isSelected ? "$color4" : undefined}
                {...rest}
            >

            </StandardCard>
        )
}
