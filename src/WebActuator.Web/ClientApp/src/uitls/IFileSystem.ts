interface IFileSystem {
    getDirectorys(path: string | null): FileInfo[];
    createDirectory(path: string|null, name: string): void;
    deleteDirectory(path: string): void;
    moveDirectory(sourceDirName: string, destDirName: string): void;
    createFile(path: string|null, name: string, value: string): void;
    readFile(path: string): string;
    writeFile(path: string, content: string): void;
    deleteFile(path: string): void;
    moveFile(sourceFileName: string, destFileName: string): void;
    copyFile(sourceFileName: string, destFileName: string): void;
    exists(path: string|null): boolean;
    combine(path1: string, path2: string, path3: string, path4: string): string;
}

interface FileInfo {
    key: string;
    name: string;
    path: string ;
    size: number;
    lastModified: Date;
    createTime: Date;
    isDirectory: boolean;
    parentPath: string | null;
}

export type {
    IFileSystem,
    FileInfo
}