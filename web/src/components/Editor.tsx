import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Tabs } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useEditorStore } from '../store/editorStore'

interface EditorProps {
  selectedFile: string | null
}

interface TabItem {
  key: string
  label: string
  content: string
  language: string
}

const Editor: React.FC<EditorProps> = ({ selectedFile }) => {
  const [activeTab, setActiveTab] = useState<string>('')
  const [tabs, setTabs] = useState<TabItem[]>([])
  const { saveFileContent } = useEditorStore()

  // 根据文件扩展名确定语言
  const getLanguageFromFileName = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'js': return 'javascript'
      case 'ts': return 'typescript'
      case 'jsx': return 'javascriptreact'
      case 'tsx': return 'typescriptreact'
      case 'html': return 'html'
      case 'css': return 'css'
      case 'json': return 'json'
      case 'md': return 'markdown'
      default: return 'plaintext'
    }
  }

  useEffect(() => {
    if (selectedFile && !tabs.some(tab => tab.key === selectedFile)) {
      // 模拟从服务器获取文件内容
      const mockFileContent = `// ${selectedFile} content\n\n// Start coding here\n`
      
      const newTab: TabItem = {
        key: selectedFile,
        label: selectedFile.split('/').pop() || selectedFile,
        content: mockFileContent,
        language: getLanguageFromFileName(selectedFile)
      }
      
      setTabs([...tabs, newTab])
      setActiveTab(selectedFile)
    } else if (selectedFile) {
      setActiveTab(selectedFile)
    }
  }, [selectedFile])

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  const handleTabClose = (key: string) => {
    const newTabs = tabs.filter(tab => tab.key !== key)
    setTabs(newTabs)
    
    if (activeTab === key && newTabs.length > 0) {
      setActiveTab(newTabs[0].key)
    } else if (newTabs.length === 0) {
      setActiveTab('')
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      setTabs(tabs.map(tab => 
        tab.key === activeTab ? { ...tab, content: value } : tab
      ))
      
      // 保存到状态管理
      saveFileContent(activeTab, value)
    }
  }

  const renderTabBar = (props: any, DefaultTabBar: any) => (
    <DefaultTabBar {...props}>
      {(node: any) => (
        <div style={{ marginRight: 8 }}>
          {node}
          {tabs.length > 1 && (
            <CloseOutlined
              style={{ marginLeft: 8 }}
              onClick={(e) => {
                e.stopPropagation()
                handleTabClose(node.key)
              }}
            />
          )}
        </div>
      )}
    </DefaultTabBar>
  )

  const currentTab = tabs.find(tab => tab.key === activeTab)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        renderTabBar={renderTabBar}
        items={tabs.map(tab => ({
          key: tab.key,
          label: tab.label,
        }))}
      />
      
      <div style={{ flex: 1 }}>
        {currentTab ? (
          <MonacoEditor
            height="100%"
            language={currentTab.language}
            value={currentTab.content}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            color: '#888',
            backgroundColor: '#1e1e1e'
          }}>
            <p>选择或创建一个文件开始编辑</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Editor 