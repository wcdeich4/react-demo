export class IndexedDBWrapper
{
    private dbName = "MyIndexedDB";
    private storeName = "MyStore";
    private dbVersion = 2;
    private db: IDBDatabase | null = null;

    constructor(){}

    public async create(): Promise<IndexedDBWrapper>
    {
        const createPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if(!db.objectStoreNames.contains(this.storeName))
                {
                    db.createObjectStore(this.storeName);
                }
            };
            request.onsuccess = (event: Event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };
            request.onerror = (event: Event) => {
                reject((event.target as IDBOpenDBRequest).error);
            };
        } );
        await createPromise;
        return this;
    }

    set(key: string, value: any): Promise<void>
    {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    get(key: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result as any);
            request.onerror = () => reject(request.error);
        });
    }

    remove(key: string): Promise<void>
    {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            transaction.oncomplete = () => {console.log('removed ' + key)};
            transaction.onerror = (event: Event) => {
                reject((event.target as IDBTransaction).error);
            }
        });
    }

    clear(): Promise<void>
    {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            transaction.oncomplete = () => {console.log('cleared ' + this.dbName)};
            transaction.onerror = () => {
                reject(transaction.error);
                console.error(transaction.error);
            }
        });

    }




}