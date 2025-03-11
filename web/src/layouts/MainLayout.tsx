import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import SplitPane from 'react-split-pane'
import { useState } from 'react'
import ImprovedActivityBar from '../components/ImprovedActivityBar'
import ImprovedSidebar from '../components/ImprovedSidebar'
import StatusBar from '../components/StatusBar'

const { Content } = Layout

const MainLayout: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(250)
  const [showSidebar, setShowSidebar] = useState(true)

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ImprovedActivityBar onToggleSidebar={toggleSidebar} />
        
        <SplitPane
          split="vertical"
          minSize={showSidebar ? 150 : 0}
          maxSize={showSidebar ? 400 : 0}
          defaultSize={showSidebar ? sidebarWidth : 0}
          onChange={(size) => setSidebarWidth(Number(size))}
          style={{ position: 'relative', flex: 1 }}
        >
          {showSidebar && <ImprovedSidebar onFileSelect={setSelectedFile} />}
          <Content style={{ height: '100%', position: 'relative' }}>
            <Outlet context={{ selectedFile }} />
          </Content>
        </SplitPane>
      </div>
      
      <StatusBar />
    </Layout>
  )
}

export default MainLayout 