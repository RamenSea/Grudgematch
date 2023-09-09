import {UnwrappedPromise} from "../general/UnwrappedPromise";


export type CacheableKeys = string | number | object; //TypeScript requires you to a more explicit type if you want toString to work on generics in case the type is Void
export interface ICacheable<KEY extends CacheableKeys> {
    cacheKey: KEY;
}
export interface ICacheStorage<T extends ICacheable<KEY>, KEY extends CacheableKeys> {
    getCachedObject(key: KEY): Promise<T|null>;
    clearCachedObject(key: KEY): Promise<void>;
    setCachedObject(t: T): Promise<void>;
}
export interface IFetchCachedObject<T extends ICacheable<KEY>, KEY extends CacheableKeys> {
    get(key: KEY): Promise<T|null>;
}
export class MemoryCacheStorage<T extends ICacheable<KEY>, KEY extends CacheableKeys> implements ICacheStorage<T, KEY> {
    private dictionary = new Map<KEY, T>();
    async clearCachedObject(key: KEY): Promise<void> {
        this.dictionary.delete(key);
    }
    async getCachedObject(key: KEY): Promise<T | null> {
        const v = this.dictionary.get(key);
        if (v === undefined) {
            return null;
        }
        return v;
    }
    async setCachedObject(t: T): Promise<void> {
        this.dictionary.set(t.cacheKey, t);
    }
}
export class SimpleCache<T extends ICacheable<KEY>, KEY extends CacheableKeys> implements IFetchCachedObject<T, KEY>{
    public cacheStorage: ICacheStorage<T, KEY>;
    public objectFetcher: IFetchCachedObject<T, KEY>;

    private pooledPromises= new Map<KEY, Promise<T>>();

    constructor(cacheStorage: ICacheStorage<T, KEY>, objectFetcher: IFetchCachedObject<T, KEY>) {
        this.cacheStorage = cacheStorage;
        this.objectFetcher = objectFetcher;
    }

    set(value: T) {
        const promise = new Promise<T>(resolve => {
            void this._set(value, resolve);
        });
        this.pooledPromises.set(value.cacheKey, promise);
        return promise;
    }
    async _set(value: T, resolve: (t: T) => void) {
        await this.cacheStorage.setCachedObject(value);
        resolve(value);
        this.pooledPromises.delete(value.cacheKey);
    }
    get(key: KEY): Promise<T | null> {
        const previousPromise = this.pooledPromises.get(key);
        if (previousPromise !== undefined) {
            return previousPromise;
        }
        const promise = new Promise<T>(resolve => {
            void this._get(key, resolve);
        });
        this.pooledPromises.set(key, promise);
        return promise;
    }
    async _get(key: KEY, resolve: (t: T) => void) {
        const fromCache = await this.cacheStorage.getCachedObject(key);
        if (fromCache !== null) {
            resolve(fromCache);
            return;
        }
        const fromFetch = await this.objectFetcher.get(key);
        if (fromFetch == null) {
            return null;
        }
        await this.cacheStorage.setCachedObject(fromFetch);
        resolve(fromFetch);
        this.pooledPromises.delete(key);
    }

}
