import './App.css';
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import React, { Component } from 'react'
import { Button, Card, Notification, Highlight, Input, Layout, Nav, TextArea, Tree, Typography, Modal } from '@douyinfe/semi-ui';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import 'monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution.js';
const { Footer, Sider, Content } = Layout;

const body = document.body;
body.setAttribute('theme-mode', 'dark');


const renderLabel = (label: any, item: any) => (
  <div style={{ display: 'flex' }}>
    {!item.isUpdate ? <span>{label}</span> : <Input value={label} />}
  </div>
);

const value = [{
  name: 'Hell word.cs',
  value: `Console.WriteLine("Hello World");`
}, {
  name: 'Rectangle.cs',
  value: `
using System;

Rectangle r = new Rectangle();
r.Acceptdetails();
r.Display();
Console.ReadLine();
class Rectangle
{
    // 成员变量
    double length;
    double width;
    public void Acceptdetails()
    {
        length = 4.5;
        width = 3.5;
    }
    public double GetArea()
    {
        return length * width;
    }
    public void Display()
    {
        Console.WriteLine("Length: {0}", length);
        Console.WriteLine("Width: {0}", width);
        Console.WriteLine("Area: {0}", GetArea());
    }
}
`
}, {
  name: 'Sizeof.cs',
  value: `Console.WriteLine("Size of int: {0}", sizeof(int));`
}]

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
    depend: false,
    searchWords: ["info", "error", "warning", "debug", "trace"],
    assembly: "",
    assemblys: [
      "http://assembly.tokengo.top:8888/System.dll",
      "http://assembly.tokengo.top:8888/System.Buffers.dll",
      "http://assembly.tokengo.top:8888/System.Collections.dll",
      "http://assembly.tokengo.top:8888/System.Core.dll",
      "http://assembly.tokengo.top:8888/System.Linq.Expressions.dll",
      "http://assembly.tokengo.top:8888/System.Linq.Parallel.dll",
      "http://assembly.tokengo.top:8888/mscorlib.dll",
      "http://assembly.tokengo.top:8888/System.Linq.dll",
      "http://assembly.tokengo.top:8888/System.Console.dll",
      "http://assembly.tokengo.top:8888/System.Runtime.dll",
      "http://assembly.tokengo.top:8888/System.Net.Http.dll",
      "http://assembly.tokengo.top:8888/System.Private.CoreLib.dll",
      "http://assembly.tokengo.top:8888/System.Console.dll"],
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
        label: 'Hell word.cs',
        isLeaf: true,
        value: 'Hell word.cs',
        isUpdate: false
      },
      {
        key: '2',
        label: 'Rectangle.cs',
        isLeaf: true,
        value: 'Rectangle.cs',
        isUpdate: false
      }
    ] as TreeNodeData[],
    editor: null as unknown as monacoEditor.editor.IStandaloneCodeEditor,
    monaco: null as unknown as typeof monacoEditor
  }
  constructor(props: {} | Readonly<{}>) {
    super(props);
    React.createRef();
  }

  componentDidMount(): void {
    document.addEventListener('click', (e) => this.handleClick());

    (window as any).OnWriteLine = (message: string) => {
      Notification.info({
        title: 'Info',
        content: message,
      })
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
    await Window.exportManage.Init();
    await Window.exportManage.SetReferences(assemblys);
  }

  async onAddAssembly() {
    var { assembly, assemblys } = this.state;
    Notification.info({
      title: 'Info',
      content: '加载程序集中...',
    })

    await (window as any).exportManage.SetReferences(['assemblys']);

    Notification.success({
      title: 'Success',
      content: '加载程序集成功',
    })

    assemblys.push(assembly);

  }

  render() {
    var { code, contextMenu, depend, treeData, editor, assembly, assemblys } = this.state;

    const options = {
      selectOnLineNumbers: true,
      automaticLayout: true,
    };

    const style = {
      width: '200px',
      height: "calc(80% - 120px)",
      border: '1px solid var(--semi-color-border)'
    };

    return (
      <Layout style={{ height: '100%' }}>
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
            <div><Button block theme='borderless' onClick={() => this.setState({
              depend: true
            })}>依赖</Button></div>
            <Tree onDoubleClick={(e, t) => {
              if (t.value) {

                let result = value.filter(x => x.name === t.value);
                if (result) {
                  editor.setValue(result[0].value)
                }
              }
            }}
              treeData={treeData}
              defaultValue={'1'}
              onChange={(e) => {
                let result = value.find(x => x.name === e);
                if (result) {
                  editor.setValue(result.value)
                }
              }}
              renderLabel={renderLabel}>
            </Tree>
          </div>
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
                height='calc(100vh - 61px)'
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
              padding: "20px",
              backgroundColor: 'var(--semi-color-bg-1)',
              textAlign: "center",
              color: "var(--semi-color-text-2)",
            }}>.NET 7 Web Assembly</Footer>
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
          <Input value={assembly} onChange={(e) => this.setState({ assembly: e })}></Input>
          <Button block onClick={()=>this.onAddAssembly()}>添加</Button>
        </Modal>
      </Layout >
    )
  }
}
