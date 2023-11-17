import {H4, Input, Sheet, XStack} from "tamagui";
import {UserList} from "../user/UserList";
import {User} from "../../models/User";
import {ThemedSpinner} from "../scaffolding/ThemedSpinner";
import {Button} from "../scaffolding/Button";


export function SelectUserDialog({
                                     isOpen,
                                     setIsOpen,
                                     username,
                                     users,
                                     isLoading,
                                     onUsernameUpdated,
                                     onRequestNextPage,
                                     onSelectUser,
                                     onSelectMe,
                                 }:{

    isOpen: boolean,
    username: string,
    users: User[],
    isLoading: boolean,
    setIsOpen: (isOpen: boolean) => void,
    onUsernameUpdated: (s: string) => void,
    onRequestNextPage: () => void,
    onSelectUser: (user: User) => void,
    onSelectMe: () => void,
}) {

    return (
        <Sheet
            forceRemoveScrollEnabled={isOpen}
            modal={true}
            open={isOpen}
            onOpenChange={setIsOpen}
            snapPoints={[96]}
            snapPointsMode={"percent"}
            dismissOnSnapToBottom
            zIndex={100_000}
            animation="medium"
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
            />
            <Sheet.Handle />
            <Sheet.Frame
                padding={16}
                maxWidth={900}
                marginLeft={"auto"}
                marginRight={"auto"}
            >
                <XStack
                    marginBottom={28}
                >
                    <H4
                        marginLeft={"auto"}
                        marginRight={"auto"}
                    >
                        Find a player
                    </H4>
                    <Button
                        right={0}
                        position={"absolute"}
                        title={"Me"}
                        onPress={e => onSelectMe()}
                    />
                </XStack>
                <Input
                    value={username}
                    placeholder={"Enter a username"}
                    onChangeText={onUsernameUpdated}
                    marginBottom={16}
                />
                {isLoading && users.length == 0 &&
                    <ThemedSpinner
                        margin={"auto"}
                    />
                }
                <UserList
                    users={users}
                    onRequestNextPage={onRequestNextPage}
                    onSelect={onSelectUser}
                    extraHorizontalPadding={16}
                />
            </Sheet.Frame>
        </Sheet>
    )
}