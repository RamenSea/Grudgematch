import {injectable} from "inversify";
import {IToastContext} from "../components/scaffolding/HookDependencyProvider";


@injectable()
export class ToastService {
    private toastController: IToastContext|null = null;

    show(title: string): boolean {
        if (this.toastController) {
            return this.toastController.show(title);
        }
        return false;
    }
    hide() {
        this.toastController?.hide();
    }
    public set(toastController: IToastContext) {
        this.toastController = toastController;
    }
}