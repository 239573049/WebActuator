import React from "react";
import { FileInfo } from "../uitls/IFileSystem";

interface FileTreeModel{
    file:FileInfo;
    label:React.ReactNode;
    children:FileTreeModel[] | undefined;
    key:string;
    value:string;
    icon:React.ReactNode;
    isLeaf:boolean;
}

export type {
    FileTreeModel
};