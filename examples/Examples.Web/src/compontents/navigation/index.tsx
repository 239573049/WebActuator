
import { Button, Input, Layout, Modal, Nav, Tree } from '@douyinfe/semi-ui';
import React, { Component, ReactNode } from 'react'
import { IconGithubLogo } from '@douyinfe/semi-icons';
import './index.css'
import { FileService } from '../../services/fileService';
import PubSub from 'pubsub-js'

const { Sider } = Layout;

interface State {
  activeIndex: number;
  dir: string;
  contextMenuVisible: boolean;
  modal: {
    title: string,
    visible: boolean,
    value:string,
    type: "file" | 'rename' | null
  },
  menuRender: ReactNode | null;
  createName: string;
  selectFile: {
    key: string,
    label: string,
    value: string
  } | null,
  tree: any[]
}

interface Props { }


const style = {
  height: 'calc(100vh - 150px)',
};

export default class Navigation extends Component<Props, State>  {

  file: FileService;
  contextMenuRef: React.RefObject<HTMLDivElement> | undefined;

  state: Readonly<State> = {
    contextMenuVisible: false,
    menuRender: null,
    activeIndex: 0,
    dir: '/',
    selectFile: null,
    createName: '',
    tree: [],
    modal: {
      title: '',
      type: null,
      value:'',
      visible: false
    }
  }

  constructor(props: Props) {
    super(props);

    this.file = new FileService();
    this.contextMenuRef = React.createRef<HTMLDivElement>();

    // 监听全局点击事件，隐藏右键菜单
    document.addEventListener('click', this.contextMenuClick.bind(this));
  }

  contextMenuClick(e: any) {
    // 判断点击的元素是否为右键菜单,或者右键菜单的子元素
    if (e.target !== this.contextMenuRef?.current && !this.contextMenuRef?.current?.contains(e.target as Node) && this.state.contextMenuVisible) {
      this.setState({
        contextMenuVisible: false,
        menuRender: null,
      })
    }
  }

  async getDir() {
    const { dir } = this.state;
    let dirs = await this.file.readDir(dir);

    if (!dirs || dirs.length === 0) {
      await this.file.createDir('/');
      await this.file.createFile('/', 'test.cs', 
`using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello Token!");
    }
}
`);
    }
    dirs = await this.file.readDir(dir);

    const selectFile = {
      key: dirs[0],
      label: dirs[0],
      value: dirs[0]
    };

    PubSub.publish('openfile', selectFile);

    this.setState({
      selectFile: selectFile,
      tree: dirs.map((item: any) => {
        return {
          key: item,
          label: item,
          value: item
        }
      })
    })

  }

  componentDidMount(): void {
    // 等待1s
    setTimeout(async () => {
      await this.getDir();
    }, 100);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.contextMenuClick.bind(this));
  }

  handleClick(index: any) {
    // 判断是否为文件
    if (index.children) return;

    // 传递打开文件事件
    PubSub.publish('openfile', index);

    this.setState({
      selectFile: index
    })
  }

  async modalHandler() {
    const { createName,modal } = this.state;
    if(modal.type === 'file'){
      if (createName) {
        if (await this.file.has(createName + ".cs")) {
          Modal.error({
            title: '文件已存在',
            content: '请重新输入',
          });
          return;
        } else {
          await this.file.createFile('/', createName + ".cs", '');
          await this.getDir();
        }
      }
  
      this.setState({
        modal: {
          title: '',
          value:'',
          type: null,
          visible: false
        },
        createName: ''
      })
    }else{
      if (createName) {
        if (await this.file.has(createName + ".cs")) {
          Modal.error({
            title: '文件已存在',
            content: '请重新输入',
          });
        } else {

          await this.file.renameFile(modal.value,createName + ".cs");

          setTimeout(async () => {
            await this.getDir();
          }
          , 100);
        }
      }
  
      this.setState({
        modal: {
          title: '',
          value:'',
          type: null,
          visible: false
        },
        createName: ''
      })
    }
  }

  contextMenu(e: any) {
    e.preventDefault();

    if (this.contextMenuRef) {
      // 移动contextMenuRef到鼠标位置的右下角的位置
      this.contextMenuRef.current?.style.setProperty('top', e.clientY + 'px');
      this.contextMenuRef.current?.style.setProperty('left', e.clientX + 'px');

      this.setState({
        contextMenuVisible: true,
        menuRender: (<>
          <div style={{
            padding: '5px',
          }}><Button size='small' block onClick={() => {
            this.setState({
              modal: {
                title: '新建文件',
                value:'',
                type:'file',
                visible: true,
              },
              contextMenuVisible: false,
              menuRender: null,
            })
          }}>新建文件</Button></div>
          <div style={{
            padding: '5px',
          }}><Button size='small' block onClick={async () => {
            await this.getDir();
            this.setState({
              contextMenuVisible: false,
              menuRender: null,
            })
          }}>刷新</Button></div>
        </>)
      })

    }
    e.stopPropagation();
  }

  contextMenuFile(e: any, node: any) {
    e.preventDefault();

    if (this.contextMenuRef) {
      // 移动contextMenuRef到鼠标位置的右下角的位置
      this.contextMenuRef.current?.style.setProperty('top', e.clientY + 'px');
      this.contextMenuRef.current?.style.setProperty('left', e.clientX + 'px');


      this.setState({
        contextMenuVisible: true,
        menuRender: (<>
          <div style={{
            padding: '5px',
          }}><Button size='small' block onClick={async () => await this.deleteFile(node)}>删除文件</Button></div>
          <div style={{
            padding: '5px',
          }}><Button size='small' block onClick={()=>this.setState({
            modal: {
              title: `重命名[${node.value}]`,
              type:'rename',
              value:node.key,
              visible: true,
            },
          })}>重命名文件</Button></div>
          <div style={{
            padding: '5px',
          }}><Button size='small' block>分享</Button></div>
        </>)
      })

    }
    e.stopPropagation();
  }

  async deleteFile(file: any) {
    this.file.deleteFile(file.value);
    await this.getDir();
    this.setState({
      contextMenuVisible: false,
    })
  }

  render() {
    const {  createName, tree, contextMenuVisible, selectFile, menuRender, modal } = this.state;
    const github = 'https://github.com/239573049';
    return (<>

      <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)', height: '100%' }}>
        <Nav
          style={{ maxWidth: 220, height: '100%' }}
          defaultSelectedKeys={['Home']}
          footer={{
            collapseButton: false,
          }}
        >
          <div className="menu" onContextMenu={(e) => this.contextMenu(e)}>
            <Tree
              onContextMenu={(e, node) => this.contextMenuFile(e, node)}
              treeData={tree}
              value={selectFile?.value}
              onDoubleClick={(e, node) => this.handleClick(node)}
              directory
              style={style}
            />
          </div>
          <div className='menu-info'>
            <Button onClick={() => window.open(github, '_blank')} style={{
              backgroundColor: 'transparent',
            }} size='large' block icon={<IconGithubLogo size='large' />} />
          </div>
        </Nav>
      </Sider>
      <div ref={this.contextMenuRef} style={{
        position: 'absolute',
        top: '0',
        zIndex: 999,
        left: '0',
        display: 'flex',
        visibility: contextMenuVisible ? "visible" : "hidden",
        borderRadius: '5px',
        flexDirection: 'column',
        backgroundColor: '#1E1E1E',
      }}>
        {menuRender ?? null}
      </div>

      <div style={{
        position: 'absolute',
        // 居中显示
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        backgroundColor: '#16161A',
        display: modal.visible ? 'block' : 'none',
        zIndex: 999,
        borderRadius: '5px',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingBottom: '5px',
      }}>
        <div style={{
          color: '#fff',
          fontSize: '20px',
          textAlign: 'center',
        }}>
          {modal.title}
        </div>
        {modal.visible && <Input
          autofocus={true}
          addonAfter='.cs'
          value={createName}
          onChange={(e) => {
            this.setState({
              createName: e
            })
          }}
          style={{
            marginTop: '20px',
          }}
          onBlur={async () => {
            await this.modalHandler()
          }} />}
      </div>
    </>
    )
  }
}
