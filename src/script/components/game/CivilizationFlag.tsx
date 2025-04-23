import {ImageRequireSource, View} from "react-native";
import {Civilization} from "../../models/Game";
import React from "react";
import {Image, Spacer} from "tamagui";

export function CivilizationFlag({
                                     civilization,
                                     width,
                                     height,
                                 }: {
                                    civilization: Civilization
                                    width?: number
                                    height?: number
                                }) {
    width = width ?? 24;
    height = height ?? 24;

    if (civilization == Civilization.NONE || civilization == Civilization.UNKNOWN) {
        return (<Spacer width={width} height={height}/>); //todo
    }

    let imageRequire!: ImageRequireSource;
    switch (civilization) {
        case Civilization.ABBASID_DYNASTY:
            imageRequire = require("../../../assets/images/flags/Abbasid.png");
            break;
        case Civilization.AYYUBIDS:
            imageRequire = require("../../../assets/images/flags/Ayyubids.png");
            break;
        case Civilization.BYZANTINES:
            imageRequire = require("../../../assets/images/flags/Byzantines.png");
            break;
        case Civilization.CHINESE:
            imageRequire = require("../../../assets/images/flags/Chinese.png");
            break;
        case Civilization.DELHI_SULTANATE:
            imageRequire = require("../../../assets/images/flags/Delhi.png");
            break;
        case Civilization.ENGLISH:
            imageRequire = require("../../../assets/images/flags/English.png");
            break;
        case Civilization.FRENCH:
            imageRequire = require("../../../assets/images/flags/French.png");
            break;
        case Civilization.HOLY_ROMAN_EMPIRE:
            imageRequire = require("../../../assets/images/flags/HRE.png");
            break;
        case Civilization.JAPANESE:
            imageRequire = require("../../../assets/images/flags/Japanese.png");
            break;
        case Civilization.JEANNE_DARC:
            imageRequire = require("../../../assets/images/flags/JeanneDarc.png");
            break;
        case Civilization.MALIANS:
            imageRequire = require("../../../assets/images/flags/Mali.png");
            break;
        case Civilization.MONGOLS:
            imageRequire = require("../../../assets/images/flags/Mongols.png");
            break;
        case Civilization.ORDER_OF_THE_DRAGON:
            imageRequire = require("../../../assets/images/flags/OrderOfTheDragon.png");
            break;
        case Civilization.OTTOMANS:
            imageRequire = require("../../../assets/images/flags/Ottoman.png");
            break;
        case Civilization.RUS:
            imageRequire = require("../../../assets/images/flags/RUS.png");
            break;
        case Civilization.ZHU_XIS_LEGACY:
            imageRequire = require("../../../assets/images/flags/ZhuXisLegacy.png");
            break;
        case Civilization.HOUSE_OF_LANCASTER:
            imageRequire = require("../../../assets/images/flags/HouseOfLancaster.png");
            break;
        case Civilization.KNIGHTS_TEMPLAR:
            imageRequire = require("../../../assets/images/flags/KnightsTemplar.png");
            break;
        default:
            return(<View/>);
    }

    return (
        <Image
            style={{
                width: width,
                height: height,
                }}
            resizeMode={"contain"}
            source={imageRequire}
        />
    )
}