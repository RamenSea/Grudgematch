import {useToastController} from "@tamagui/toast";


export type IToastContext = {
    show: (title: string) => boolean
    hide: () => void
}
export function HookDependencyProvider({
    onUpdate,
                                       }:{
    onUpdate: (toastController: IToastContext) => void,
}) {

    const toastController = useToastController();
    onUpdate(toastController);

    return null;
}