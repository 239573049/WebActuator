// db.ts
export class IndexedDB {
    public db: IDBDatabase | null = null;

    constructor(name: string, version: number, private objectStoreName: string) {
        const request: IDBOpenDBRequest = window.indexedDB.open(name, version);

        request.onerror = (_) => {
            console.log(`数据库打开报错`);
        };

        request.onsuccess = (event: Event) => {
            this.db = (event.target as IDBOpenDBRequest).result;
            console.log(`数据库打开成功`);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(objectStoreName)) {
                db.createObjectStore(objectStoreName, { autoIncrement: true });
            }
        };
    }

    add(data: any): any {
        return new Promise((resolve, reject) => {

            const request = this.db?.transaction([this.objectStoreName], 'readwrite')
                .objectStore(this.objectStoreName)
                .add(data, data.key);

            if (request) {
                request!.onsuccess = (_) => {
                    console.log('写入数据成功',);
                    resolve(request?.result);
                }

                request!.onerror = (_) => {
                    console.log('写入数据失败',);
                    reject(request?.result);
                }

            } else {
                reject();
            }
        });
    }

    read(key: string): any {
        return new Promise((resolve, reject) => {

            const transaction = this.db?.transaction([this.objectStoreName]);
            const objectStore = transaction?.objectStore(this.objectStoreName);
            const request: IDBRequest<any> | undefined = objectStore?.get(key);

            if (request) {
                request!.onsuccess = (_) => {
                    console.log('读取数据成功');
                    resolve(request?.result);
                }

                request!.onerror = (_) => {
                    console.log('读取数据失败，未找到数据');
                    reject(request?.result);
                }
            } else {
                reject();
            }

        });
    }

    readAll(): any {
        return new Promise((resolve, reject) => {
            const objectStore = this.db?.transaction(this.objectStoreName).objectStore(this.objectStoreName);
            const request = objectStore?.getAll();

            if (request) {
                request!.onsuccess = (_) => {
                    console.log('读取数据成功',);
                    resolve(request?.result);
                }

                request!.onerror = (_) => {
                    console.log('读取数据失败，未找到数据');
                    reject(request?.result);
                }
            } else {
                reject();
            }
        });
    }

    update(key: string, data: any): any {
        return new Promise((resolve, reject) => {

            const request = this.db?.transaction([this.objectStoreName], 'readwrite')
                .objectStore(this.objectStoreName)
                .put(data, key);

            if (request) {
                request!.onsuccess = (_) => {
                    console.log('更新数据成功',);
                    resolve(request?.result);
                }

                request!.onerror = (_) => {
                    console.log('更新数据失败，未找到数据');
                    reject(request?.result);
                }
            } else {
                reject();
            }

        });

    }

    remove(key: string): any {
        return new Promise((resolve, reject) => {

            const request = this.db?.transaction([this.objectStoreName], 'readwrite')
                .objectStore(this.objectStoreName)
                .delete(key);

            if (request) {
                request!.onsuccess = (_) => {
                    console.log('删除数据成功',);
                    resolve(request?.result);
                }

                request!.onerror = (_) => {
                    console.log('删除数据失败，未找到数据');
                    reject(request?.result);
                }
            } else {
                reject();
            }

        });

    }

    /**
     * 判断是否存在某个key
     * @param key 
     * @returns 
     */
    has(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {

            const request = this.db?.transaction([this.objectStoreName], 'readwrite')
                .objectStore(this.objectStoreName)
                .get(key);

            if (request) {
                request!.onsuccess = (_) => {
                    resolve(request?.result);
                };

                request!.onerror = (_) => {
                    reject(request?.result);
                }
            } else {
                reject();
            }
        });
    }

    Transcation(): IDBTransaction {
        return this.db?.transaction([this.objectStoreName], 'readwrite')!;
    }
}
