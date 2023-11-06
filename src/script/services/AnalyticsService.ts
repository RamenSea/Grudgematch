import {FirebaseInit, FirebaseLogScreen} from "./Firebase";
import {injectable} from "inversify";

@injectable()
export class AnalyticsService {

    setUp() {
        FirebaseInit();
    }

    logScreen(screenName: string) {
        FirebaseLogScreen(screenName);
    }
}