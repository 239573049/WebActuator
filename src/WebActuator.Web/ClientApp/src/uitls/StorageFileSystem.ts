import { FileInfo, IFileSystem } from "./IFileSystem";

const key = "FileSystem";


class StorageFileSystem implements IFileSystem {

    static FileInfos: FileInfo[] = [];

    constructor() {
        let result = localStorage.getItem(key);
        if (result) {
            StorageFileSystem.FileInfos = JSON.parse(result) as FileInfo[];
        } else {
            this.createDirectory(null, "Demo");
        }
    }
    combine(path1: string, path2: string, path3?: string, path4?: string): string {
        let value = path1 + "/" + path2;
        if (path3) {
            value += "/" + path3;
        }
        if (path4) {
            value += "/" + path4;
        }
        return value;
    }

    createDirectory(path: string | null, name: string): void {
        if (this.exists(path ? this.combine(path, name) : name)) {
            throw new Error("Directory already exists");
        }
        let info: FileInfo = {
            name: name,
            path: path ? this.combine(path, name) : name,
            size: 0,
            lastModified: new Date(),
            createTime: new Date(),
            isDirectory: true,
            parentPath: path,
            key: path ? this.combine(path, name) : name,
        }
        StorageFileSystem.FileInfos.push(info);
        this.save();
    }

    deleteDirectory(path: string): void {
        var index = StorageFileSystem.FileInfos.findIndex(x => x.path === path);
        if (index === -1) {
            throw new Error("Directory not exists");
        }
        StorageFileSystem.FileInfos.splice(index, 1);
        this.save();
    }

    moveDirectory(sourceDirName: string, destDirName: string): void {
        throw new Error("Method not implemented.");
    }

    createFile(path: string, name: string, value?: string): void {
        if (this.exists(path ? this.combine(path, name) : name)) {
            throw new Error("File already exists");
        }
        let info: FileInfo = {
            name: name,
            path: path ? this.combine(path, name) : name,
            size: value ? value.length : 0,
            lastModified: new Date(),
            createTime: new Date(),
            isDirectory: false,
            parentPath: path,
            key: path ? this.combine(path, name) : name,
        }

        StorageFileSystem.FileInfos.push(info);
        this.save();
        if (value) {
            this.setContent(info.path, value);
        }
    }
    readFile(path: string): string {
        var index = StorageFileSystem.FileInfos.findIndex(x => x.path === path);
        if (index === -1) {
            throw new Error("File not exists");
        }
        return this.readContent(StorageFileSystem.FileInfos[index].path);
    }
    writeFile(path: string, content: string): void {
        var index = StorageFileSystem.FileInfos.findIndex(x => x.path === path);
        if (index === -1) {
            throw new Error("File not exists");
        }
        StorageFileSystem.FileInfos[index].size = content.length;
        StorageFileSystem.FileInfos[index].lastModified = new Date();
        this.save();
        this.setContent(StorageFileSystem.FileInfos[index].path, content);
    }
    deleteFile(path: string): void {
        var index = StorageFileSystem.FileInfos.findIndex(x => x.path === path);
        if (index === -1) {
            throw new Error("File not exists");
        }
        StorageFileSystem.FileInfos.splice(index, 1);
        this.save();
        this.setContent(path, "");
    }
    moveFile(sourceFileName: string, destFileName: string): void {
        throw new Error("Method not implemented.");
    }
    copyFile(sourceFileName: string, destFileName: string): void {
        throw new Error("Method not implemented.");
    }

    exists(path: string | null): boolean {
        return StorageFileSystem.FileInfos.findIndex(x => x.path === path) !== -1;
    }

    getDirectorys(path: string | null): FileInfo[] {
        var list = StorageFileSystem.FileInfos.filter(x => x.parentPath === path);
        console.log('getDirectorys', path, 'list', list);
        return list;
    }

    save(): void {
        localStorage.setItem(key, JSON.stringify(StorageFileSystem.FileInfos));
    }

    setContent(key: string, value: string) {
        if (value) {
            localStorage.setItem("FileSysytem:" + key, value);
        } else {
            localStorage.removeItem("FileSysytem:" + key);
        }
    }

    readContent(key: string): string {
        return localStorage.getItem("FileSysytem:" + key) || "";
    }
}

export {
    StorageFileSystem
}