import {H4, Input, Sheet} from "tamagui";
import {ChevronDown} from "@tamagui/lucide-icons";
import {Button} from "../scaffolding/Button";
import {UserList} from "../user/UserList";
import {User} from "../../models/User";
import {ThemedSpinner} from "../scaffolding/ThemedSpinner";


export function SelectUserDialog({
    isOpen,
    setIsOpen,
    username,
    onUsernameUpdated,
    users,
                                     onRequestNextPage,
                                     onSelectUser,
    isLoading,
                                 }:{

    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    username: string,
    onUsernameUpdated: (s: string) => void,
    users: User[],
    onRequestNextPage: () => void,
    onSelectUser: (user: User) => void,
    isLoading: boolean,
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
            >
                <H4
                    marginBottom={16}
                    marginLeft={"auto"}
                    marginRight={"auto"}
                >
                    Find a player
                </H4>
                <Input
                    value={username}
                    placeholder={"Enter a username"}
                    onChangeText={onUsernameUpdated}
                    marginBottom={16}
                />
                <UserList
                    users={users}
                    onRequestNextPage={onRequestNextPage}
                    onSelect={onSelectUser}
                />
                {isLoading && users.length == 0 &&
                    <ThemedSpinner
                        margin={"auto"}
                    />
                }
            </Sheet.Frame>
        </Sheet>
    )
}