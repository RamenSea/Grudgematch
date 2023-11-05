import analytics from '@react-native-firebase/analytics';


export function FirebaseInit() {

}

export async function FirebaseLogScreen(screenName: string) {
    await analytics().logEvent(screenName);
}