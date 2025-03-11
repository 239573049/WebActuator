import { create } from 'zustand'

interface FileContent {
  [filePath: string]: string
}

interface EditorState {
  fileContents: FileContent
  saveFileContent: (filePath: string, content: string) => void
  getFileContent: (filePath: string) => string | null
}

export const useEditorStore = create<EditorState>((set, get) => ({
  fileContents: {},
  
  saveFileContent: (filePath, content) => {
    set((state) => ({
      fileContents: {
        ...state.fileContents,
        [filePath]: content
      }
    }))
  },
  
  getFileContent: (filePath) => {
    return get().fileContents[filePath] || null
  }
})) 