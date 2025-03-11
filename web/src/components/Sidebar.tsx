import { useState } from 'react'
import { Tree, Input, Dropdown, Menu } from 'antd'
import { FileOutlined, FolderOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import type { DataNode, TreeProps } from 'antd/es/tree'

interface SidebarProps {
  onFileSelect: (filePath: string) => void
}

// 模拟文件系统数据
const initialTreeData: DataNode[] = [
  {
    title: 'src',
    key: 'src',
    isLeaf: false,
    children: [
      {
        title: 'components',
        key: 'src/components',
        isLeaf: false,
        children: [
          {
            title: 'Editor.tsx',
            key: 'src/components/Editor.tsx',
            isLeaf: true,
          },
          {
            title: 'Sidebar.tsx',
            key: 'src/components/Sidebar.tsx',
            isLeaf: true,
          },
        ],
      },
      {
        title: 'App.tsx',
        key: 'src/App.tsx',
        isLeaf: true,
      },
      {
        title: 'main.tsx',
        key: 'src/main.tsx',
        isLeaf: true,
      },
    ],
  },
  {
    title: 'public',
    key: 'public',
    isLeaf: false,
    children: [
      {
        title: 'index.html',
        key: 'public/index.html',
        isLeaf: true,
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ onFileSelect }) => {
  const [treeData, setTreeData] = useState<DataNode[]>(initialTreeData)
  const [searchValue, setSearchValue] = useState<string>('')
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['src', 'src/components'])

  const handleSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    const key = selectedKeys[0] as string
    if (info.node.isLeaf) {
      onFileSelect(key)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchValue(value)
    
    if (value) {
      // 简单搜索实现
      const expandedKeys: string[] = []
      const searchTree = (nodes: DataNode[], parentKey?: string): DataNode[] => {
        return nodes.map(node => {
          const key = node.key as string
          const title = node.title as string
          const isMatch = title.toLowerCase().includes(value.toLowerCase())
          
          const children = node.children ? searchTree(node.children, key) : []
          
          if (isMatch || children.length > 0) {
            if (parentKey) expandedKeys.push(parentKey)
            if (!node.isLeaf) expandedKeys.push(key)
            return { ...node, children }
          }
          
          return { ...node, children: [] }
        }).filter(node => {
          const title = node.title as string
          return title.toLowerCase().includes(value.toLowerCase()) || (node.children && node.children.length > 0)
        })
      }
      
      const filteredData = searchTree(initialTreeData)
      setTreeData(filteredData)
      setExpandedKeys([...new Set(expandedKeys)])
    } else {
      setTreeData(initialTreeData)
    }
  }

  const renderTreeNodes = (data: DataNode[]): DataNode[] => {
    return data.map(item => {
      if (item.children) {
        return {
          ...item,
          icon: ({ expanded }: { expanded: boolean }) => (
            <FolderOutlined style={{ color: expanded ? '#1890ff' : undefined }} />
          ),
          children: renderTreeNodes(item.children),
        }
      }
      return {
        ...item,
        icon: <FileOutlined />,
      }
    })
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#252526' }}>
      <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: '#ccc' }}>资源管理器</span>
        <div>
          <PlusOutlined style={{ color: '#ccc', marginRight: 8, cursor: 'pointer' }} />
          <EllipsisOutlined style={{ color: '#ccc', cursor: 'pointer' }} />
        </div>
      </div>
      
      <Input
        placeholder="搜索文件"
        value={searchValue}
        onChange={handleSearch}
        style={{ margin: '0 8px 8px', width: 'calc(100% - 16px)' }}
        allowClear
      />
      
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Tree
          showIcon
          showLine={{ showLeafIcon: false }}
          treeData={renderTreeNodes(treeData)}
          onSelect={handleSelect}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys as string[])}
        />
      </div>
    </div>
  )
}

export default Sidebar 