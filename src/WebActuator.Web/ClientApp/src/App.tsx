import './App.css';
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import React, { Component } from 'react'
import { Button, Card, Notification, Highlight, Input, Layout, Nav, TextArea, Tree, Typography, Modal, Tabs, TabPane, Upload, Skeleton, Spin, Divider } from '@douyinfe/semi-ui';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import 'monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution.js';
import { DiagnosticDto } from './models/exportManage';
import axios from 'axios';
import { defaultAssemblys, defaultFiles } from './configs/config';

const query = new URLSearchParams(window.location.search);

const { Sider } = Layout;

let assemblys = [];

if (localStorage.getItem('assemblys')) {
  assemblys = JSON.parse(localStorage.getItem('assemblys') as string);
} else {
  assemblys = defaultAssemblys;
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
    loading: true,
    newShow: false,
    newFileValue: "",
    code: 'Console.WriteLine("Hello World");',
    logContent: '',
    errprContent: '',
    depend: false,
    searchWords: ["info", "error", "warning", "debug", "trace"],
    assembly: "",
    assemblys: [...defaultAssemblys],
    contextMenu: {
      x: -1000,
      y: -1000
    },
    fileMenu: {
      x: -1000,
      y: -1000,
      value: null
    },
    treeData: [] as TreeNodeData[],
    editor: null as unknown as monacoEditor.editor.IStandaloneCodeEditor,
    monaco: null as unknown as typeof monacoEditor
  }

  componentDidMount(): void {

    const files = localStorage.getItem('files');
    // 如果存在文件列表则加载
    if (files) {
      this.setState({
        treeData: JSON.parse(files)
      })
    } else {
      this.setState({
        treeData: defaultFiles
      })
      localStorage.setItem('files', JSON.stringify(defaultFiles));
    }

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

    this.onInit()
    this.split()
  }

  split() {
    var splitter = document.getElementById('splitter')!;
    var code = document.getElementById('code')!;
    var render = document.getElementById('render')!;

    var mouseDownHandler = function (e: any) {
      // Prevent text selection
      e.preventDefault();

      // Set initial positions
      var startPos = e.clientX;
      let startLeftWidth = code!.offsetWidth;
      let startRightWidth = render!.offsetWidth;

      // Define the mouse move handler
      var mouseMoveHandler = function (e: any) {
        // Calculate the new widths
        var newLeftWidth = startLeftWidth + (e.clientX - startPos);
        var newRightWidth = startRightWidth - (e.clientX - startPos);

        // Update the widths
        code.style.width = newLeftWidth + 'px';
        render.style.width = newRightWidth + 'px';
      };

      // Define the mouse up handler
      var mouseUpHandler = function () {
        // Remove the handlers
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      // Add the handlers
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    splitter.addEventListener('mousedown', mouseDownHandler);
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
    try {

      let Window = window as any;
      var { assemblys } = this.state;
      await Window.exportManage.SetReferences(assemblys);

      this.setState({
        loading: false,
      })

    } catch {
      setTimeout(() => {
        this.onInit()
      }, 1000);
    }
  }

  async onAddAssembly(datas: any[] | null = null) {
    var { assembly, assemblys } = this.state;
    Notification.info({
      title: 'Info',
      content: '加载程序集中...',
    })
    this.setState({
      loading: true,
    })
    try {
      if (datas) {
        console.log(datas);
        await (window as any).exportManage.SetReferences(datas);
      } else {
        console.log(assembly);
        await (window as any).exportManage.SetReferences([assembly]);
      }

      assemblys.push(assembly);
      localStorage.setItem('assemblys', JSON.stringify(assemblys));

      Notification.success({
        title: 'Success',
        content: '加载程序集成功',
      })

    } catch (error) {
      Notification.error({
        title: '错误',
        content: '加载程序集失败',
      })
    } finally {

      this.setState({
        loading: false,
      })
    }

  }

  onRemoveAssembly() {
    this.setState({
      assemblys: defaultAssemblys
    }, () => {
      localStorage.setItem('assemblys', JSON.stringify(defaultAssemblys));
    })
  }

  async beforeUpload({ file, fileList }: any) {
    let assembly = [file.url];
    await this.onAddAssembly(assembly)
    return true;
  }

  onNewFile() {
    const { treeData, newFileValue } = this.state;
    // 如果存在则不添加
    if (treeData.find((item: any) => item.label === newFileValue)) {
      Notification.error({
        title: '错误',
        content: '文件已存在',
      });

      return;
    }

    var treeDatas = [...treeData];
    treeDatas.push(
      { key: newFileValue, label: newFileValue, isLeaf: true, value: newFileValue, isUpdate: false }
    );

    localStorage.setItem('files', JSON.stringify(treeDatas));
    localStorage.setItem(newFileValue, 'Console.WriteLine("Hello World");')
    this.setState({
      treeData: treeDatas,
      newShow: false,
      newFileValue: ''
    });

  }

  getValue(value: any) {
    var { editor } = this.state;

    const code = localStorage.getItem(value);
    if (code) {
      editor.setValue(code)
    } else {
      axios.get(`/code/${value}`).then((res: any) => {
        if (res.data) {
          editor.setValue(res.data)
        }
      });
    }
  }

  render() {
    const { code, loading, errprContent, logContent, contextMenu, newShow, newFileValue, depend, treeData, assembly, assemblys } = this.state;

    const options = {
      selectOnLineNumbers: true,
      automaticLayout: true,
    };

    const home = query.get('home');

    return (
      <Layout style={{ height: '100%', overflow: 'hidden' }}>
        <Sider style={{ backgroundColor: "var(--semi-color-bg-1)", width: '200px', minWidth: '200px' }} >
          <div style={{
            justifyContent: "space-between",
            padding: "10px",
            textAlign: "center",
            color: "var(--semi-color-text-2)",
          }}>
            Web IDE
          </div>
          {home ? <Button theme='borderless' block onClick={() => {
            window.open(home, '_self');
          }}>首页</Button> : <></>}
          <div style={{ maxHeight: 'calc(100vh - 180px)', overflow: 'auto' }}>
            <Tree
              treeData={treeData}
              defaultValue={'1'}
              onChange={(e) => this.getValue(e)}
              renderLabel={renderLabel}>
            </Tree>
          </div>
          <Divider style={{ margin: 12 }} />
          <Button block theme='borderless' onClick={() => this.onRunCode()}>执行代码</Button>
          <Button block theme='borderless' onClick={() => this.setState({ newShow: true })}>新增文件</Button>
          <div><Button block theme='borderless' onClick={() => this.setState({
            depend: true
          })}>管理编译依赖</Button></div>
        </Sider>
        <div id="code">
          <MonacoEditor
            language="csharp"
            theme="vs-dark"
            value={code}
            height='100%'
            width={'100%'}
            options={options}
            onChange={(value, e) => this.onChange(value, e)}
            editorDidMount={(editor, monaco) => this.editorDidMount(editor, monaco)}
          />
        </div>

        <div id="splitter"></div>

        <div id="render">
          <MonacoEditor
            language="text"
            theme="vs-dark"
            value={logContent}
            height='100%'
            width={'100%'}
            options={options} />
        </div>
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
        <Modal
          header={null}
          visible={newShow}
          style={{ padding: '20px', textAlign: 'center' }}
          onCancel={() => this.setState({ newShow: false })}
          footer={[]}
        >
          <h2>新增文件</h2>
          <Input style={{ margin: '5px' }} value={newFileValue} onChange={(e) => this.setState({ newFileValue: e })} placeholder='请输入文件名'></Input>
          <Button block theme='borderless' onClick={() => this.onNewFile()}>新建</Button>
        </Modal>
      </Layout >
    )
  }
}
