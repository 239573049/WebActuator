import { useOutletContext } from 'react-router-dom'
import CodeEditorView from '../components/CodeEditorView'

interface EditorContextType {
  selectedFile: string | null
}

const EditorPage: React.FC = () => {
  const { selectedFile } = useOutletContext<EditorContextType>()
  
  return <CodeEditorView selectedFile={selectedFile} />
}

export default EditorPage