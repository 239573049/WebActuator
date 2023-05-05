import './App.css';
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import React, { Component } from 'react'
import { Button, Card, Divider, Layout, Nav, Tree } from '@douyinfe/semi-ui';
import MonacoEditor from 'react-monaco-editor';
import { FileInfo, IFileSystem } from './uitls/IFileSystem';
import { StorageFileSystem } from './uitls/StorageFileSystem';
import { FileTreeModel } from './models/treeModel';

const { Header, Footer, Sider, Content } = Layout;

let FileSystem: IFileSystem;

export default class App extends Component {
  state = {
    code: 'Console.WriteLine("Hello World");',
    fileInfo: null as FileInfo | null,
    data: [] as FileTreeModel[],
    contextMenu: {
      x: 0,
      y: 0
    },
    fileMenu: {
      x: 0,
      y: 0,
      value: null
    },
    editor: null as unknown as monacoEditor.editor.IStandaloneCodeEditor,
    monaco: null as unknown as typeof monacoEditor
  }
  constructor(props: {} | Readonly<{}>) {
    super(props);
    React.createRef()
    FileSystem = new StorageFileSystem();
  }

  componentDidMount(): void {
    document.addEventListener('click', (e) => this.handleClick());
    this.onLoad()
    setTimeout(() => {
      this.onInit()
    }, 2000);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', (e) => this.handleClick());
  }

  onLoad() {
    var { fileInfo } = this.state;
    let result = FileSystem.getDirectorys(fileInfo ? fileInfo?.parentPath : null)
    var data = result.map((file: FileInfo) => {
      let node: FileTreeModel = {
        key: file.path,
        label: file.name,
        isLeaf: !file.isDirectory,
        children: file.isDirectory ? [] : undefined,
        file: file,
        value: '',
        icon: undefined
      }
      return node;
    });
    if (data) {
      this.setState({
        data: data
      })
    }
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

  handleContextMenuFile(event: any, tree: FileTreeModel) {
    event.preventDefault();
    this.setState({
      fileMenu: {
        x: event.clientX,
        y: event.clientY,
        value: tree
      },
      fileInfo: tree.file
    })
  }

  updateTreeData(list: any[], key: any, children: any): any {
    return list.map(node => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: this.updateTreeData(node.children, key, children) };
      }
      return node;
    });
  }

  onLoadData = (treeNode: FileTreeModel) => {
    return new Promise<void>(resolve => {
      let files = FileSystem.getDirectorys(treeNode!.file.key);

      if (files) {
        var result = files.map((file: FileInfo) => {
          return {
            key: file.path,
            label: file.name,
            isLeaf: !file.isDirectory,
            children: file.isDirectory ? [] : undefined,
            file: file,
            value: file.key,
            icon: undefined
          } as FileTreeModel;
        });

        this.setState({
          data: [...this.updateTreeData(this.state.data, treeNode.key, result)]
        })
      }
      resolve();
    })
  }

  onCreateFile() {
    var { fileInfo } = this.state;

    var path = null;
    if (fileInfo?.isDirectory) {
      path = fileInfo.path;
    } else {
      path = fileInfo?.parentPath;
    }
    path = path ? path : null
    FileSystem.createFile(path, '新建文件.cs', '');
    this.onLoad()
  }

  onCreateDirectory() {
    var { fileInfo } = this.state;

    var path = null;
    if (fileInfo?.isDirectory) {
      path = fileInfo.path;
    } else {
      path = fileInfo?.parentPath;
    }

    FileSystem.createDirectory(path ? path : null, '新建文件夹');
    this.onLoad()
  }

  onRunCode() {
    var { editor, code, } = this.state;
    
    let Window = window as any;
    Window.exportManage.RunSubmission(code, false);
  }

  async onInit() {
    let Window = window as any;
    let assembly = [
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Buffers.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Collections.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Core.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Linq.Expressions.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Linq.Parallel.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/mscorlib.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Linq.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Console.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Runtime.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Net.Http.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Private.CoreLib.dll",
      "https://token-web-ide.oss-cn-shenzhen.aliyuncs.com/assembly/System.Console.dll"];
    await Window.exportManage.SetReferences(assembly);
  }

  render() {
    var { code, contextMenu, fileMenu, data,editor } = this.state;

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
          <Tree
            treeData={data}
            defaultExpandAll
            onContextMenu={(event, tree: any) => this.handleContextMenuFile(event, tree)}
            directory
            onChange={(value: any) => {
              try{
                var code=FileSystem.readFile(value);
                 this.setState({
                  code
                 })
                 editor.setValue(code)
              }catch{

              }
            }}
            loadData={(tree: any) => this.onLoadData(tree)}
            style={style}
          />
          {fileMenu?.x > 0 && (
            <Card
              style={{
                top: fileMenu.y,
                left: fileMenu.x,
                width: "80px",
                backgroundColor: 'white'
              }} className='menu'>
              <Button block theme='borderless' size='small' onClick={() => this.onCreateFile()}>新建文件</Button>
              <Button block theme='borderless' size='small' onClick={() => this.onCreateDirectory()}>新建文件夹</Button>
              {fileMenu.value && <Button block theme='borderless' size='small' >重命名</Button>}
            </Card>
          )}
        </Sider>
        <Layout
          className="web-layout">
          <Content style={{
            height: 'max-content',
          }}>
            <div onContextMenu={(e) => this.handleContextMenu(e)} style={{ height: '100%', width: '100%' }}>
              <MonacoEditor
                height={'100%'}
                language="csharp"
                theme="vs-dark"
                value={code}
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
                <Button theme='borderless' size='small' onClick={() => this.onRunCode()}>执行c#程序</Button>
              </Card>
            )}
          </Content>
          <Footer
            style={{
              justifyContent: "space-between",
              padding: "20px",
              textAlign: "center",
              color: "var(--semi-color-text-2)",
            }}>.NET 7 Web Assembly</Footer>
        </Layout>
      </Layout>
    )
  }
}
