import { IndexedDB } from "../utils/db";



export class FileService {
    file: IndexedDB;
    catalog: IndexedDB;
    constructor() {
        this.file = new IndexedDB('file', 1, 'file');
        this.catalog = new IndexedDB('catalog', 1, 'catalog');
    }

    /**
     * 创建文件
     * @param fileName 
     * @param fileData 
     */
    async createFile(dir:string,fileName: string, fileData: string) {
        if(!await this.catalog.has(dir)){
            this.createDir(dir);
        }

        this.updateDir(dir, [...await this.readDir(dir),fileName]);

        // 判断文件是否存在，存在则更新，不存在则创建
        if (await this.file.has(fileName)) {
            this.updateFile(fileName, fileData);
        } else {
            this.file.add({ key:fileName, fileData });
        }
    }

    /**
     * 读取文件
     * @param fileName 
     * @returns 
     */
    async readFile(fileName: string): Promise<any> {
        return await this.file.read(fileName);;
    }

    deleteFile(fileName: string): void {
        this.file.remove(fileName);
    }

    /**
     * 更新文件
     * @param fileName 
     * @param fileData 
     */
    updateFile(fileName: string, fileData: string): void {
        this.file.update(fileName, { key: fileName, fileData });
    }

    /**
     * 创建目录
     * @param dirName 
     */
    async createDir(dirName: string): Promise<void> {
        // 判断目录是否存在，存在则更新，不存在则创建
        if (await this.catalog.has(dirName)) {
            this.updateDir(dirName, []);
        } else {
            this.catalog.add({ key:dirName, fileList: [] });
        }
    }

    /**
     * 删除目录
     * @param dirName 
     */
    deleteDir(dirName: string): void {
        this.catalog.remove(dirName);
    }

    /**
     * 更新目录列表
     * @param dirName 目录名称 
     * @param fileList 文件列表
     */
    updateDir(dirName: string, fileList: string[]): void {
        this.catalog.update(dirName, { dirName, fileList });
    }

    /**
     * 读取目录列表
     * @param dirName 
     * @returns 
     */
    readDir(dirName: string): any{
        return new Promise((resolve, reject) => {
            this.catalog.read(dirName).then((res: any) => {
                resolve(res?.fileList??[]);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    async has(key:string){
        if(await this.file.has(key) || await this.catalog.has(key)){
            return true;
        }
    }
}