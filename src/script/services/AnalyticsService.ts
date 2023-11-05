import {FirebaseInit} from "./Firebase";
import {injectable} from "inversify";
import {FirebaseLogScreen} from "./Firebase.web";

@injectable()
export class AnalyticsService {

    setUp() {
        FirebaseInit();
    }

    logScreen(screenName: string) {
        FirebaseLogScreen(screenName);
    }
}