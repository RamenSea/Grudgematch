import {User} from "./User";
import {Game} from "./Game";


export class MatchUp {
    constructor(
        readonly user: User,
        readonly opponent: User,
        readonly games: Game[]) {
    }
}