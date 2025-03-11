import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Tabs, Collapse, Button, Tooltip } from 'antd'
import { CloseOutlined, CaretRightOutlined, InfoCircleOutlined } from '@ant-design/icons'
import SplitPane from 'react-split-pane'
import { useEditorStore } from '../store/editorStore'

interface CodeEditorViewProps {
    selectedFile: string | null
}

interface TabItem {
    key: string
    label: string
    content: string
    language: string
    theme: string
}

const { Panel } = Collapse;



const CodeEditorView: React.FC<CodeEditorViewProps> = ({ selectedFile }) => {
    const [activeTab, setActiveTab] = useState<string>('')
    const [tabs, setTabs] = useState<TabItem[]>([])
    const [showBuilderPanel, setShowBuilderPanel] = useState(true)
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
                theme: 'vs-dark',
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

    const toggleBuilderPanel = () => {
        setShowBuilderPanel(!showBuilderPanel)
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
        <SplitPane
            split="vertical"
            minSize={showBuilderPanel ? 300 : 0}
            maxSize={showBuilderPanel ? 450 : 0}
            defaultSize={showBuilderPanel ? 350 : 0}
            primary="second"
            style={{ height: '100%' }}
        >
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
                                theme: 'vs-dark'
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

            {showBuilderPanel && (
                <div style={{
                    height: '100%',
                    backgroundColor: '#252526',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '10px',
                        borderBottom: '1px solid #333',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, color: '#fff' }}>
                            <Button type="text" style={{ color: '#ccc' }}>
                                Chat
                            </Button>
                            <Button type="text"style={{ color: '#ccc' }}>
                                Builder
                            </Button>
                        </h3>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={toggleBuilderPanel}
                            style={{ color: '#ccc' }}
                        />
                    </div>

                    <div style={{
                        padding: '10px',
                        color: '#ccc',
                        borderBottom: '1px solid #333',
                    }}>
                        <p>轻松构建界面组件-您的项目助手。在 Builder 模式下，对代码实现快捷自定义配置和自动预览。</p>
                    </div>

                    <Collapse
                        defaultActiveKey={['1']}
                        ghost
                        expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} style={{ color: '#ccc' }} />
                        )}
                        style={{ overflowY: 'auto' }}
                    >
                        <Panel
                            header={
                                <div style={{ color: '#fff' }}>
                                    <InfoCircleOutlined style={{ marginRight: '8px' }} />
                                    小贴士
                                </div>
                            }
                            key="1"
                        >
                            <div style={{ padding: '8px', color: '#ccc' }}>
                                想着有提示？"活动的列表"、AI 帮你解决
                            </div>
                        </Panel>
                    </Collapse>

                    <div style={{
                        marginTop: 'auto',
                        borderTop: '1px solid #333',
                        padding: '10px'
                    }}>
                        <div style={{
                            display: 'flex',
                            padding: '10px',
                            backgroundColor: '#1e1e1e',
                            border: '1px solid #333',
                            borderRadius: '4px'
                        }}>
                            <input
                                type="text"
                                placeholder="包历史记录输入，'Shift+Enter' 换行"
                                style={{
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#ccc',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            padding: '4px'
                        }}>
                            <div style={{ color: '#ccc' }}>
                                <span style={{ marginRight: '10px' }}># 引用</span>
                                <Tooltip title="图片">
                                    <Button type="text" icon={<span>📎</span>} size="small" style={{ color: '#ccc' }} />
                                </Tooltip>
                            </div>
                            <div>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<span>↑</span>}
                                    style={{ color: '#ccc' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SplitPane>
    )
}

export default CodeEditorView