import { Tooltip } from 'antd'
import { 
  FileOutlined, 
  SearchOutlined, 
  BranchesOutlined, 
  BugOutlined, 
  SettingOutlined 
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

interface ActivityBarProps {
  onToggleSidebar: () => void
}

const ImprovedActivityBar: React.FC<ActivityBarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 导航到指定路由并执行额外操作
  const navigateTo = (path: string, extraAction?: () => void) => {
    return () => {
      navigate(path);
      if (extraAction) extraAction();
    };
  };
  
  // 判断当前路由是否激活
  const isActive = (path: string) => {
    if (path === '/editor') {
      return location.pathname === '/editor' || location.pathname === '/';
    }
    return location.pathname === path;
  };
  
  return (
    <div style={{
      width: '48px',
      height: '100%',
      backgroundColor: '#333333',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '10px',
      borderRight: '1px solid #252526'
    }}>
      <Tooltip title="资源管理器" placement="right">
        <div 
          onClick={navigateTo('/editor', onToggleSidebar)}
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: isActive('/editor') ? '#fff' : '#aaa',
            borderLeft: isActive('/editor') ? '2px solid #fff' : '2px solid transparent',
          }}
        >
          <FileOutlined style={{ fontSize: '24px' }} />
        </div>
      </Tooltip>
      
      <Tooltip title="搜索" placement="right">
        <div 
          onClick={navigateTo('/search')}
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: isActive('/search') ? '#fff' : '#aaa',
            borderLeft: isActive('/search') ? '2px solid #fff' : '2px solid transparent',
          }}
        >
          <SearchOutlined style={{ fontSize: '24px' }} />
        </div>
      </Tooltip>
      
      <Tooltip title="源代码管理" placement="right">
        <div 
          onClick={navigateTo('/source-control')}
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: isActive('/source-control') ? '#fff' : '#aaa',
            borderLeft: isActive('/source-control') ? '2px solid #fff' : '2px solid transparent',
          }}
        >
          <BranchesOutlined style={{ fontSize: '24px' }} />
        </div>
      </Tooltip>
      
      <Tooltip title="运行和调试" placement="right">
        <div 
          onClick={navigateTo('/debug')}
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: isActive('/debug') ? '#fff' : '#aaa',
            borderLeft: isActive('/debug') ? '2px solid #fff' : '2px solid transparent',
          }}
        >
          <BugOutlined style={{ fontSize: '24px' }} />
        </div>
      </Tooltip>
      
      <div style={{ flex: 1 }}></div>
      
      <Tooltip title="设置" placement="right">
        <div 
          onClick={navigateTo('/settings')}
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: isActive('/settings') ? '#fff' : '#aaa',
            borderLeft: isActive('/settings') ? '2px solid #fff' : '2px solid transparent',
            marginBottom: '10px'
          }}
        >
          <SettingOutlined style={{ fontSize: '24px' }} />
        </div>
      </Tooltip>
    </div>
  )
}

export default ImprovedActivityBar