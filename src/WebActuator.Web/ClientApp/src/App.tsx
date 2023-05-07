import './App.css';
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import React, { Component } from 'react'
import { Button, Card, Notification, Highlight, Input, Layout, Nav, TextArea, Tree, Typography, Modal, Tabs, TabPane, Upload } from '@douyinfe/semi-ui';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import 'monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution.js';
import { DiagnosticDto } from './models/exportManage';
import axios from 'axios';

const { Footer, Sider, Content } = Layout;

let assemblys = [];

if (localStorage.getItem('assemblys')) {
  assemblys = JSON.parse(localStorage.getItem('assemblys') as string);
} else {
  assemblys = [
    "https://assembly.tokengo.top:8843/System.dll",
    "https://assembly.tokengo.top:8843/System.Buffers.dll",
    "https://assembly.tokengo.top:8843/System.Collections.dll",
    "https://assembly.tokengo.top:8843/System.Core.dll",
    "https://assembly.tokengo.top:8843/System.Linq.Expressions.dll",
    "https://assembly.tokengo.top:8843/System.Linq.Parallel.dll",
    "https://assembly.tokengo.top:8843/mscorlib.dll",
    "https://assembly.tokengo.top:8843/System.Linq.dll",
    "https://assembly.tokengo.top:8843/System.Console.dll",
    "https://assembly.tokengo.top:8843/System.Runtime.dll",
    "https://assembly.tokengo.top:8843/System.Net.Http.dll",
    "https://assembly.tokengo.top:8843/System.Private.CoreLib.dll",
    "https://assembly.tokengo.top:8843/System.Console.dll"]

  // 初次加载默认加载这些程序集
  localStorage.setItem('assemblys', JSON.stringify(assemblys));
}

const body = document.body;
body.setAttribute('theme-mode', 'dark');

let log = ''

const renderLabel = (label: any, item: any) => (
  <div style={{ display: 'flex' }}>
    {!item.isUpdate ? <span>{label}</span> : <Input value={label} />}
  </div>
);

window.self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId: any, label: any) {
    if (label === 'json') {
      return './json.worker.bundle.js';
    }
    if (label === 'csharp') {
      return './csharp.worker.bundle.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './css.worker.bundle.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.bundle.js';
    }
    return './editor.worker.bundle.js';
  }
};


export default class App extends Component {
  state = {
    code: 'Console.WriteLine("Hello World");',
    logContent: '',
    errprContent: '',
    depend: false,
    searchWords: ["info", "error", "warning", "debug", "trace"],
    assembly: "",
    assemblys: [
      "https://assembly.tokengo.top:8843/System.dll",
      "https://assembly.tokengo.top:8843/System.Buffers.dll",
      "https://assembly.tokengo.top:8843/System.Collections.dll",
      "https://assembly.tokengo.top:8843/System.Core.dll",
      "https://assembly.tokengo.top:8843/System.Linq.Expressions.dll",
      "https://assembly.tokengo.top:8843/System.Linq.Parallel.dll",
      "https://assembly.tokengo.top:8843/mscorlib.dll",
      "https://assembly.tokengo.top:8843/System.Linq.dll",
      "https://assembly.tokengo.top:8843/System.Console.dll",
      "https://assembly.tokengo.top:8843/System.Runtime.dll",
      "https://assembly.tokengo.top:8843/System.Net.Http.dll",
      "https://assembly.tokengo.top:8843/System.Private.CoreLib.dll",
      "https://assembly.tokengo.top:8843/System.Console.dll"],
    contextMenu: {
      x: -1000,
      y: -1000
    },
    fileMenu: {
      x: -1000,
      y: -1000,
      value: null
    },
    treeData: [
      {
        key: '1',
        label: 'Hello World.cs',
        isLeaf: true,
        value: 'Hello World.cs',
        isUpdate: false
      },
      {
        key: '2',
        label: 'Calculator.cs',
        isLeaf: true,
        value: 'Calculator.cs',
        isUpdate: false
      },
      {
        key: '3',
        label: 'StudentAchievement.cs',
        isLeaf: true,
        value: 'StudentAchievement.cs',
        isUpdate: false
      },
      {
        key: '4',
        label: '乘法表.cs',
        isLeaf: true,
        value: '乘法表.cs',
        isUpdate: false
      },
      {
        key: '5',
        label: '判断偶数.cs',
        isLeaf: true,
        value: '判断偶数.cs',
        isUpdate: false
      },
      {
        key: '6',
        label: '算和.cs',
        isLeaf: true,
        value: '算和.cs',
        isUpdate: false
      },
      {
        key: '7',
        label: '冒泡排序.cs',
        isLeaf: true,
        value: '冒泡排序.cs',
        isUpdate: false
      },
      {
        key: '8',
        label: '递归树形.cs',
        isLeaf: true,
        value: '递归树形.cs',
        isUpdate: false
      }] as TreeNodeData[],
    editor: null as unknown as monacoEditor.editor.IStandaloneCodeEditor,
    monaco: null as unknown as typeof monacoEditor
  }
  constructor(props: {} | Readonly<{}>) {
    super(props);
  }

  componentDidMount(): void {
    document.addEventListener('click', (e) => this.handleClick());

    (window as any).WriteLine = (message: string) => {
      log += message;
      this.setState({
        logContent: log
      })
    }

    (window as any).Diagnostic = (json: string) => {
      var diagnostic = JSON.parse(json) as DiagnosticDto[];
      diagnostic.forEach((item: DiagnosticDto) => {
        this.setState((prevState: any) => ({
          errprContent: prevState.errprContent + item.Code + ":" + item.Message
        }))
      });
    }

    setTimeout(() => {
      this.onInit()
    }, 3000);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', (e) => this.handleClick());
  }


  handleClick() {
    this.setState({
      contextMenu: null,
      fileMenu: null
    })
  }

  editorDidMount(editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      this.onRunCode()
    });

    editor.focus();
    this.setState({
      editor: editor,
      monaco: monaco
    })
  }

  onChange(newValue: any, e: any) {
    this.setState({
      code: newValue
    })
  }

  handleContextMenu(event: any) {
    event.preventDefault();
    this.setState({
      contextMenu: {
        x: event.clientX,
        y: event.clientY
      }
    })
  }

  onRunCode() {
    var { editor, code, } = this.state;

    let Window = window as any;
    Window.exportManage.RunSubmission(code, false);
  }

  async onInit() {
    let Window = window as any;
    var { assemblys } = this.state;
    await Window.exportManage.SetReferences(assemblys);
  }

  async onAddAssembly(datas: any[] | null = null) {
    var { assembly, assemblys } = this.state;
    Notification.info({
      title: 'Info',
      content: '加载程序集中...',
    })
    if (datas) {
      console.log(datas);
      await (window as any).exportManage.SetReferences(datas);
    } else {
      console.log(assembly);
      await (window as any).exportManage.SetReferences([assembly]);
    }

    Notification.success({
      title: 'Success',
      content: '加载程序集成功',
    })

    assemblys.push(assembly);
    localStorage.setItem('assemblys', JSON.stringify(assemblys));
  }

  onRemoveAssembly() {
    var { assemblys } = this.state;
    assemblys = [
      "https://assembly.tokengo.top:8843/System.dll",
      "https://assembly.tokengo.top:8843/System.Buffers.dll",
      "https://assembly.tokengo.top:8843/System.Collections.dll",
      "https://assembly.tokengo.top:8843/System.Core.dll",
      "https://assembly.tokengo.top:8843/System.Linq.Expressions.dll",
      "https://assembly.tokengo.top:8843/System.Linq.Parallel.dll",
      "https://assembly.tokengo.top:8843/mscorlib.dll",
      "https://assembly.tokengo.top:8843/System.Linq.dll",
      "https://assembly.tokengo.top:8843/System.Console.dll",
      "https://assembly.tokengo.top:8843/System.Runtime.dll",
      "https://assembly.tokengo.top:8843/System.Net.Http.dll",
      "https://assembly.tokengo.top:8843/System.Private.CoreLib.dll",
      "https://assembly.tokengo.top:8843/System.Console.dll"];

    this.setState({
      assemblys: assemblys
    }, () => {
      localStorage.setItem('assemblys', JSON.stringify(assemblys));
    })
  }

  async beforeUpload({ file, fileList }: any) {
    let assembly = [file.url];
    await this.onAddAssembly(assembly)
    return true;
  }

  render() {
    var { code, errprContent, logContent, contextMenu, depend, treeData, editor, assembly, assemblys } = this.state;

    const options = {
      selectOnLineNumbers: true,
      automaticLayout: true,
    };

    return (
      <Layout style={{ height: '100%', overflow: 'hidden' }}>
        <Sider style={{ backgroundColor: "var(--semi-color-bg-1)", width: '200px' }} >
          <div style={{
            justifyContent: "space-between",
            padding: "10px",
            textAlign: "center",
            color: "var(--semi-color-text-2)",
          }}>
            Web IDE
          </div>
          <div>
            <Tree
              treeData={treeData}
              defaultValue={'1'}
              onChange={(e) => {
                axios.get(`/code/${e}`).then((res: any) => {
                  if (res.data) {
                    editor.setValue(res.data)
                  }
                });
              }}
              renderLabel={renderLabel}>
            </Tree>
          </div>
          <div><Button block theme='borderless' onClick={() => this.setState({
            depend: true
          })}>管理编译依赖</Button></div>
        </Sider>
        <Layout
          className="web-layout">
          <Content style={{
            height: 'max-content',
          }}>
            <div onContextMenu={(e) => this.handleContextMenu(e)} style={{ height: '100%', width: '100%', maxHeight: '100%' }}>
              <MonacoEditor
                language="csharp"
                theme="vs-dark"
                value={code}
                height='calc(100vh - 150px)'
                options={options}
                onChange={(value, e) => this.onChange(value, e)}
                editorDidMount={(editor, monaco) => this.editorDidMount(editor, monaco)}
              />
            </div>
            {contextMenu && (
              <Card
                style={{
                  top: contextMenu.y,
                  left: contextMenu.x,
                  backgroundColor: 'white'
                }} className='menu'>
                <Button theme='borderless' size='small' onClick={() => this.onRunCode()}>执行</Button>
              </Card>
            )}
          </Content>
          <Footer
            style={{
              justifyContent: "space-between",
              height: "150px",
              backgroundColor: 'var(--semi-color-bg-1)',
              color: "var(--semi-color-text-2)",
            }}>
            <Tabs type="card" style={{ height: '100%' }}>
              <TabPane tab="输出" itemKey="1" style={{ overflow: 'auto', maxHeight: '100px' }}>
                <code style={{ whiteSpace: 'pre-wrap' }}>
                  {logContent}
                </code>
              </TabPane>
              <TabPane tab="错误" itemKey="2" style={{ overflow: 'auto', maxHeight: '100px' }}>
                <code style={{ whiteSpace: 'pre-wrap', color: 'red' }}>
                  {errprContent}
                </code>
              </TabPane>
            </Tabs>
          </Footer>
        </Layout>
        <Modal
          header={null}
          visible={depend}
          onCancel={() => this.setState({ depend: false })}
          footer={[]}
        >
          <h3 style={{ textAlign: 'center', fontSize: 24, margin: 40 }}>编译依赖项</h3>
          <Card>
            {assemblys.map(x => {
              return (
                <div style={{ marginBottom: 10 }}>
                  <span>{x}</span>
                </div>
              )
            })}
          </Card>
          <Input style={{
            marginTop: 10
          }} value={assembly} onChange={(e) => this.setState({ assembly: e })}></Input>
          <Button style={{
            marginTop: 10
          }} block onClick={() => this.onAddAssembly()}>添加</Button>
          <Button style={{
            marginTop: 10
          }} block onClick={() => this.onRemoveAssembly()}>还原</Button>

          <Upload style={{
            marginTop: 10
          }}
            draggable={true}
            transformFile={(file) => {
              var url = URL.createObjectURL(file);
              var assembly = [url];
              this.onAddAssembly(assembly);
              return file as any;
            }}
            showUploadList={false}
            dragMainText={'点击上传文件或拖拽文件到这里'}
            dragSubText="上传程序集"
          ></Upload>
        </Modal>
      </Layout >
    )
  }
}
