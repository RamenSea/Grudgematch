import {User} from "./User";
import {Game} from "./Game";


export class MatchUp {
    constructor(
        readonly opponent: User,
        readonly games: Game[]) {
    }
}