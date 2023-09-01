

export class User {
    constructor(
        readonly aoe4WorldId: number,
        readonly steamId: string|null,
        readonly username: string,
        readonly fullAvatarImageUrl: string | null,
        readonly mediumAvatarImageUrl: string | null,
        readonly smallAvatarImageUrl: string | null
    ) { }


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
