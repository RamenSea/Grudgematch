import {Image as ImageView, ImageRequireSource, View} from "react-native";
import {Civilization} from "../../models/Game";

export function CivilizationFlag({
                                     civilization,
                                     width,
                                     height,
                                 }: {
                                    civilization: Civilization
                                    width?: number
                                    height?: number
                                }) {
    if (civilization == Civilization.NONE) {
        return (<View/>); //todo
    }
    width = width ?? 24;
    height = height ?? 24;

    let imageRequire!: ImageRequireSource;
    switch (civilization) {
        case Civilization.ABBASID_DYNASTY:
            imageRequire = require("../../../assets/images/flags/Abbasid.png");
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
        case Civilization.MALIANS:
            imageRequire = require("../../../assets/images/flags/Mali.png");
            break;
        case Civilization.MONGOLS:
            imageRequire = require("../../../assets/images/flags/Mongols.png");
            break;
        case Civilization.OTTOMANS:
            imageRequire = require("../../../assets/images/flags/Ottoman.png");
            break;
        case Civilization.RUS:
            imageRequire = require("../../../assets/images/flags/RUS.png");
            break;
        default:
            return(<View/>);
    }

    return (
        <ImageView
            style={{
                width: width,
                height: height,
                }}
            resizeMode={"contain"}
            source={imageRequire}
        />
    )
}