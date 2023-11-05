// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent} from "firebase/analytics";
import config_json from "./FirebaseWebConfig.json";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = config_json;



export function FirebaseInit() {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
}

export function FirebaseLogScreen(screenName: string) {
    const analytics = getAnalytics();
    logEvent(analytics, 'screen_view', {
        firebase_screen: screenName,
        firebase_screen_class: screenName
    });
}