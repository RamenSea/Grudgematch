import {Image as ImageView, View} from "react-native";
import {Civilization} from "../../models/Game";


export function CivilizationFlag({
                                     civilization,
                                 }: {
                                    civilization: Civilization
                                }) {
    if (civilization == Civilization.NONE) {
        return (<View/>); //todo
    }

    let imageName = "";
    let relativePathToImages = "./assets/images/flags/"
    switch (civilization) {
        case Civilization.ABBASID_DYNASTY:
            imageName = "Abbasid.png"
            break;
        case Civilization.CHINESE:
            imageName = "Chinese.png"
            break;
        case Civilization.DELHI_SULTANATE:
            imageName = "Delhi.png"
            break;
        case Civilization.ENGLISH:
            imageName = "English.png"
            break;
        case Civilization.FRANCE:
            imageName = "France.png"
            break;
        case Civilization.HOLY_ROMAN_EMPIRE:
            imageName = "HRE.png"
            break;
        case Civilization.MALIANS:
            imageName = "Mali.png"
            break;
        case Civilization.MONGOLS:
            imageName = "Mongols.png"
            break;
        case Civilization.OTTOMANS:
            imageName = "Ottoman.png"
            break;
        case Civilization.RUS:
            imageName = "RUS.png"
            break;
    }

    return (
        <ImageView
            source={{uri: relativePathToImages + imageName}}
        />
    )
}