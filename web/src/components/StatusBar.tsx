import { BranchesOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'

const StatusBar: React.FC = () => {
  return (
    <div style={{
      height: '22px',
      backgroundColor: '#007acc',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      fontSize: '12px',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center' }}>
          <BranchesOutlined style={{ marginRight: '5px' }} />
          <span>main</span>
        </div>
        
        <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center' }}>
          <CheckCircleOutlined style={{ marginRight: '5px' }} />
          <span>0 错误</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WarningOutlined style={{ marginRight: '5px' }} />
          <span>0 警告</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '15px' }}>UTF-8</div>
        <div style={{ marginRight: '15px' }}>TypeScript</div>
        <div>Ln 1, Col 1</div>
      </div>
    </div>
  )
}

export default StatusBar 