import {Rank} from "../../models/User";
import {StyleProp, View, ViewStyle} from "react-native";
import {SvgProps} from "react-native-svg";

import SoloUnranked from "../../../assets/images/ranks/solo_unranked.svg";
import SoloBronze1 from "../../../assets/images/ranks/solo_bronze_1.svg";
import SoloBronze2 from "../../../assets/images/ranks/solo_bronze_2.svg";
import SoloBronze3 from "../../../assets/images/ranks/solo_bronze_3.svg";
import SoloSilver1 from "../../../assets/images/ranks/solo_silver_1.svg";
import SoloSilver2 from "../../../assets/images/ranks/solo_silver_2.svg";
import SoloSilver3 from "../../../assets/images/ranks/solo_silver_3.svg";
import SoloGold1 from "../../../assets/images/ranks/solo_gold_1.svg";
import SoloGold2 from "../../../assets/images/ranks/solo_gold_2.svg";
import SoloGold3 from "../../../assets/images/ranks/solo_gold_3.svg";
import SoloPlatinum1 from "../../../assets/images/ranks/solo_platinum_1.svg";
import SoloPlatinum2 from "../../../assets/images/ranks/solo_platinum_2.svg";
import SoloPlatinum3 from "../../../assets/images/ranks/solo_platinum_3.svg";
import SoloDiamond1 from "../../../assets/images/ranks/solo_diamond_1.svg";
import SoloDiamond2 from "../../../assets/images/ranks/solo_diamond_2.svg";
import SoloDiamond3 from "../../../assets/images/ranks/solo_diamond_3.svg";
import SoloConqueror1 from "../../../assets/images/ranks/solo_conqueror_1.svg";
import SoloConqueror2 from "../../../assets/images/ranks/solo_conqueror_2.svg";
import SoloConqueror3 from "../../../assets/images/ranks/solo_conqueror_3.svg";

import TeamUnranked from "../../../assets/images/ranks/team_unranked.svg";
import TeamBronze1 from "../../../assets/images/ranks/team_bronze_1.svg";
import TeamBronze2 from "../../../assets/images/ranks/team_bronze_2.svg";
import TeamBronze3 from "../../../assets/images/ranks/team_bronze_3.svg";
import TeamSilver1 from "../../../assets/images/ranks/team_silver_1.svg";
import TeamSilver2 from "../../../assets/images/ranks/team_silver_2.svg";
import TeamSilver3 from "../../../assets/images/ranks/team_silver_3.svg";
import TeamGold1 from "../../../assets/images/ranks/team_gold_1.svg";
import TeamGold2 from "../../../assets/images/ranks/team_gold_2.svg";
import TeamGold3 from "../../../assets/images/ranks/team_gold_3.svg";
import TeamPlatinum1 from "../../../assets/images/ranks/team_platinum_1.svg";
import TeamPlatinum2 from "../../../assets/images/ranks/team_platinum_2.svg";
import TeamPlatinum3 from "../../../assets/images/ranks/team_platinum_3.svg";
import TeamDiamond1 from "../../../assets/images/ranks/team_diamond_1.svg";
import TeamDiamond2 from "../../../assets/images/ranks/team_diamond_2.svg";
import TeamDiamond3 from "../../../assets/images/ranks/team_diamond_3.svg";
import TeamConqueror1 from "../../../assets/images/ranks/team_conqueror_1.svg";
import TeamConqueror2 from "../../../assets/images/ranks/team_conqueror_2.svg";
import TeamConqueror3 from "../../../assets/images/ranks/team_conqueror_3.svg";
import {ReactNode} from "react";
import {NumberProp} from "react-native-svg/src/lib/extract/types";


export function RankIcon({
                             rank,
                            isSolo,
                             width,
                             height,
                            collapseIfNone
                                 }: {
    rank: Rank
    isSolo: boolean
    width?: NumberProp;
    height?: NumberProp;
    collapseIfNone?: boolean;
}) {
    if (rank == Rank.NONE) {
        if (collapseIfNone) {
            return (<View/>);
        }
        return (
            <View
                style={{
                    width: width ?? 0,
                    height: height ?? 0,
                }}
            />
        )
    }

    let SvgIcon!: React.FC<SvgProps> = TeamConqueror1;
    switch (rank) {
        case Rank.UNRANKED:
            SvgIcon = isSolo ? SoloUnranked : TeamUnranked;
            break;
        case Rank.BRONZE_1:
            SvgIcon = isSolo ? SoloBronze1 : TeamBronze1;
            break;
        case Rank.BRONZE_2:
            SvgIcon = isSolo ? SoloBronze2 : TeamBronze2;
            break;
        case Rank.BRONZE_3:
            SvgIcon = isSolo ? SoloBronze3 : TeamBronze3;
            break;
        case Rank.SILVER_1:
            SvgIcon = isSolo ? SoloSilver1 : TeamSilver1;
            break;
        case Rank.SILVER_2:
            SvgIcon = isSolo ? SoloSilver2 : TeamSilver2;
            break;
        case Rank.SILVER_3:
            SvgIcon = isSolo ? SoloSilver3 : TeamSilver3;
            break;
        case Rank.GOLD_1:
            SvgIcon = isSolo ? SoloGold1 : TeamGold1;
            break;
        case Rank.GOLD_2:
            SvgIcon = isSolo ? SoloGold2 : TeamGold2;
            break;
        case Rank.GOLD_3:
            SvgIcon = isSolo ? SoloGold3 : TeamGold3;
            break;
        case Rank.PLATINUM_1:
            SvgIcon = isSolo ? SoloPlatinum1 : TeamPlatinum1;
            break;
        case Rank.PLATINUM_2:
            SvgIcon = isSolo ? SoloPlatinum2 : TeamPlatinum2;
            break;
        case Rank.PLATINUM_3:
            SvgIcon = isSolo ? SoloPlatinum3 : TeamPlatinum3;
            break;
        case Rank.DIAMOND_1:
            SvgIcon = isSolo ? SoloDiamond1 : TeamDiamond1;
            break;
        case Rank.DIAMOND_2:
            SvgIcon = isSolo ? SoloDiamond2 : TeamDiamond2;
            break;
        case Rank.DIAMOND_3:
            SvgIcon = isSolo ? SoloDiamond3 : TeamDiamond3;
            break;
        case Rank.CONQUEROR_1:
            SvgIcon = isSolo ? SoloConqueror1 : TeamConqueror1;
            break;
        case Rank.CONQUEROR_2:
            SvgIcon = isSolo ? SoloConqueror2 : TeamConqueror2;
            break;
        case Rank.CONQUEROR_3:
            SvgIcon = isSolo ? SoloConqueror3 : TeamConqueror3;
            break;
    }

    return (
        <SvgIcon
            width={width}
            height={height}
        />
    )
}