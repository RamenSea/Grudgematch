

export class User {
    public static MIN_USERNAME_LENGTH = 3;
    public static NULL_AOE4WORLD_ID = -1;
    public static NULL_STEAM_ID = "-1";
    public static NULL_USER = new User(
        User.NULL_AOE4WORLD_ID,
        User.NULL_STEAM_ID,
        "NULL",
        "",
        "",
        "",
    )
    constructor(
        readonly aoe4WorldId: number,
        readonly steamId: string|null,
        readonly username: string,
        readonly fullAvatarImageUrl: string,
        readonly mediumAvatarImageUrl: string,
        readonly smallAvatarImageUrl: string,
    ) { }

    isNull(): boolean {
        return this.aoe4WorldId == User.NULL_AOE4WORLD_ID;
    }

    //TODO figure out a good JSON deserialization library
    toJson(): any {
        return {
            profile_id: this.aoe4WorldId,
            steam_id: this.steamId,
            name: this.username,
            avatars: {
                full: this.fullAvatarImageUrl,
                medium: this.mediumAvatarImageUrl,
                small: this.smallAvatarImageUrl,
            }
        }
    }
    static FromJson(jsonObject: any): User {
        return new User(
            jsonObject.profile_id,
            jsonObject.steam_id,
            jsonObject.name,
            jsonObject.avatars.full,
            jsonObject.avatars.medium,
            jsonObject.avatars.small,
        )
    }
}
