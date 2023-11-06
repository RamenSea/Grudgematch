import analytics from '@react-native-firebase/analytics';


export function FirebaseInit() {
    console.log("Native FirebaseInit")
}

export async function FirebaseLogScreen(screenName: string) {
    console.log("Native FirebaseInit")
    await analytics().logEvent(screenName);
}