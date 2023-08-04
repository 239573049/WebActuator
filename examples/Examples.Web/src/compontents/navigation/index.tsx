
import { Button, Input, Layout, Modal, Nav, Tree } from '@douyinfe/semi-ui';
import { Component } from 'react'
import { IconGithubLogo } from '@douyinfe/semi-icons';
import './index.css'
import { FileService } from '../../services/fileService';
import PubSub from 'pubsub-js'

const { Sider } = Layout;

interface State {
  activeIndex: number;
  dir: string;
  createVisible: boolean;
  createName: string;
  selectFile: {
    key: string,
    label: string,
    value: string
  } | null,
  tree: []
}

interface Props { }


const style = {
  height: 'calc(100vh - 150px)',
};

export default class Navigation extends Component<Props, State>  {

  file: FileService;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeIndex: 0,
      dir: '/',
      createVisible: false,
      selectFile: null,
      createName: '',
      tree: []
    };
    this.file = new FileService();

  }

  async getDir() {
    const { dir } = this.state;
    let dirs = await this.file.readDir(dir);

    if (!dirs || dirs.length === 0) {
      await this.file.createDir('/');
      await this.file.createFile('/', 'test.cs', 'class Program\n{\n    static void Main(string[] args)\n    {\n        // your code goes here\n    }\n}');
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

  handleClick(index: any) {
    // 判断是否为文件
    if (index.children) return;

    // 传递打开文件事件
    PubSub.publish('openfile', index);

    this.setState({
      selectFile: index
    })
  }

  async creFile() {
    const { createName } = this.state;
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
      createVisible: false,
      createName: ''
    })
  }

  render() {
    const { createVisible, createName, tree, selectFile } = this.state;
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
          <div className="menu">
            <Tree
              treeData={tree}
              value={selectFile?.value}
              onDoubleClick={(e, node) => this.handleClick(node)}
              directory
              style={style}
            />
            <div id='indicator' className="indicator"></div>
            {!createVisible ? <Button onClick={() => this.setState({
              createVisible: true
            })} style={{
              marginTop: '20px',
            }} block>新增</Button> :
              <Input
                autofocus={true}
                value={createName}
                onChange={(e) => {
                  this.setState({
                    createName: e
                  })
                }}
                style={{
                  marginTop: '20px',
                }}
                onBlur={async (e) => {
                  await this.creFile()
                }}
                addonAfter=".cs" />}
          </div>
          <div className='menu-info'>
            <Button onClick={() => window.open(github, '_blank')} style={{
              backgroundColor: 'transparent',
            }} size='large' block icon={<IconGithubLogo size='large' />} />
          </div>
        </Nav>
      </Sider>

    </>
    )
  }
}
