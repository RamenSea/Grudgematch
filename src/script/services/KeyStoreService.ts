import {MMKV} from "react-native-mmkv";
import {injectable} from "inversify";
import {TypedJSON} from "typedjson";


// Really thin wrapper around MMKV, in case something else needs to be dropped in its place
@injectable()
export class KeyStoreService {

    private storage: MMKV
    constructor() {
        this.storage = new MMKV({id: "gm_"});
    }
    set(key: string, value: boolean | string | number | Uint8Array): void {
        this.storage.set(key, value);
    }
    setObject<T>(key: string, o: T, serializer: TypedJSON<T>) {
        const s = serializer.stringify(o)
        this.set(key, s);
    }
    setObjectArray<T>(key: string, o: T[], serializer: TypedJSON<T>) {
        const s = serializer.stringifyAsArray(o)
        this.set(key, s);
    }
    getBoolean(key: string): boolean | undefined {
        return this.storage.getBoolean(key);
    }
    getString(key: string): string | undefined {
        return this.storage.getString(key);
    }
    getNumber(key: string): number | undefined {
        return this.storage.getNumber(key);
    }
    getBuffer(key: string): Uint8Array | undefined {
        return this.storage.getBuffer(key);
    }
    getObject<T>(key: string, serializer: TypedJSON<T>): T | undefined {
        const s = this.getString(key);
        if (s) {
            try {
                return serializer.parse(s);
            } catch (e) {
                console.error(e);
            }
        }
        return undefined;
    }
    getObjectArray<T>(key: string, serializer: TypedJSON<T>): T[] | undefined {
        const s = this.getString(key);
        if (s) {
            try {
                return serializer.parseAsArray(s);
            } catch (e) {
                console.error(e);
            }
        }
        return undefined;
    }


    contains(key: string): boolean {
        return this.storage.contains(key);
    }
    delete(key: string) {
        this.storage.delete(key);
    }
    clearAll(): void {
        this.storage.clearAll();
    }
}