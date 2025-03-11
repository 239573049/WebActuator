import { useState } from 'react';
import { Tree, Input, Dropdown, Menu } from 'antd';
import { 
  FileOutlined, 
  FolderOutlined, 
  FileTextOutlined,
  FileMarkdownOutlined,
  FileUnknownOutlined,
  FolderOpenOutlined,
  PlusOutlined, 
  EllipsisOutlined,
  CaretDownOutlined
} from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';

interface SidebarProps {
  onFileSelect: (filePath: string) => void;
}

// 模拟文件系统数据
const initialTreeData: DataNode[] = [
  {
    title: 'Gateway',
    key: 'Gateway',
    isLeaf: false,
    children: [
    ],
  },
  {
    title: 'Plugins',
    key: 'Plugins',
    isLeaf: false,
    children: [],
  }
];

// 文件图标映射
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (fileName.startsWith('_') && fileName.endsWith('.bat')) {
    return <FileTextOutlined style={{ color: '#6A9FB5' }} />;
  }
  
  switch (extension) {
    case 'html':
      return <FileTextOutlined style={{ color: '#E44D26' }} />;
    case 'css':
      return <FileTextOutlined style={{ color: '#264DE4' }} />;
    case 'js':
      return <FileUnknownOutlined style={{ color: '#F0DB4F' }} />;
    case 'ts':
    case 'tsx':
      return <FileTextOutlined style={{ color: '#007ACC' }} />;
    case 'jsx':
      return <FileTextOutlined style={{ color: '#61DAFB' }} />;
    case 'json':
      return <FileTextOutlined style={{ color: '#F0DB4F' }} />;
    case 'md':
      return <FileMarkdownOutlined style={{ color: '#83a598' }} />;
    case 'cs':
      return <FileTextOutlined style={{ color: '#1F9D55' }} />;
    case 'csproj':
      return <FileTextOutlined style={{ color: '#1F9D55' }} />;
    default:
      return <FileOutlined style={{ color: '#aaa' }} />;
  }
};

const ImprovedSidebar: React.FC<SidebarProps> = ({ onFileSelect }) => {
  const [treeData, setTreeData] = useState<DataNode[]>(initialTreeData);
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['Gateway']);

  const handleSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    const key = selectedKeys[0] as string;
    if (info.node.isLeaf) {
      onFileSelect(key);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    
    if (value) {
      // 简单搜索实现
      const expandedKeys: string[] = [];
      const searchTree = (nodes: DataNode[], parentKey?: string): DataNode[] => {
        return nodes.map(node => {
          const key = node.key as string;
          const title = node.title as string;
          const isMatch = title.toLowerCase().includes(value.toLowerCase());
          
          const children = node.children ? searchTree(node.children, key) : [];
          
          if (isMatch || children.length > 0) {
            if (parentKey) expandedKeys.push(parentKey);
            if (!node.isLeaf) expandedKeys.push(key);
            return { ...node, children };
          }
          
          return { ...node, children: [] };
        }).filter(node => {
          const title = node.title as string;
          return title.toLowerCase().includes(value.toLowerCase()) || (node.children && node.children.length > 0);
        });
      };
      
      const filteredData = searchTree(initialTreeData);
      setTreeData(filteredData);
      setExpandedKeys([...new Set(expandedKeys)]);
    } else {
      setTreeData(initialTreeData);
    }
  };

  // 渲染树节点
  const renderTreeNodes = (data: DataNode[]): DataNode[] => {
    // @ts-ignore
    return data.map(item => {
      const title = item.title as string;
      
      if (item.children) {
        return {
          ...item,
          icon: ({ expanded }: { expanded: boolean }) => 
            expanded ? 
              <FolderOpenOutlined style={{ color: '#FFCC44' }} /> : 
              <FolderOutlined style={{ color: '#FFCC44' }} />,
          children: renderTreeNodes(item.children),
        };
      }
      
      return {
        ...item,
        icon: getFileIcon(title),
      };
    });
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#252526',
      borderRight: '1px solid #333'
    }}>
      <div style={{ 
        padding: '8px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
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
        style={{ 
          margin: '8px 8px', 
          width: 'calc(100% - 16px)',
          backgroundColor: '#3C3C3C',
          border: 'none',
          color: '#CCC'
        }}
        allowClear
      />
      
      <div style={{ flex: 1, overflow: 'auto', padding: '0 4px' }}>
        <Tree
          showIcon
          showLine={{ showLeafIcon: false }}
          treeData={renderTreeNodes(treeData)}
          onSelect={handleSelect}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys as string[])}
          switcherIcon={<CaretDownOutlined style={{ fontSize: '10px' }} />}
          style={{
            backgroundColor: 'transparent',
          }}
          titleRender={(nodeData) => {
            const title = nodeData.title as string;
            return (
              <span style={{ 
                color: '#CCC',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {title}
              </span>
            );
          }}
        />
      </div>
    </div>
  );
};

export default ImprovedSidebar;