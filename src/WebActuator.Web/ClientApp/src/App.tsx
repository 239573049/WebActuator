import './App.css';

import React, { Component } from 'react'
import { Button, Divider, Layout, Nav, Tree } from '@douyinfe/semi-ui';
import MonacoEditor from 'react-monaco-editor';
import {
  IconFolderOpen,
} from "@douyinfe/semi-icons";

const { Header, Footer, Sider, Content } = Layout;

const treeData = [
  {
    label: 'Dotnet',
    value: 'Asia',
    key: '0',
    children: [
      {
        label: 'Program.cs',
        value: 'China',
        key: '0-0',
      },
    ],
  }
];
export default class App extends Component {

  state = {
    code: 'Console.WriteLine("Hello World");',
  }

  constructor(props: {} | Readonly<{}>) {
    super(props);
  }

  componentDidMount(): void {
  }

  componentWillUnmount(): void {

  }

  editorDidMount(editor: any, monaco: any) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue: any, e: any) {
    console.log('onChange', newValue, e);
  }

  render() {
    var { code } = this.state;

    const options = {
      selectOnLineNumbers: true,
      automaticLayout: true,
    };
    const style = {
      width: '150px',
      height: "calc(100% - 120px)",
      border: '1px solid var(--semi-color-border)'
    };

    return (
      <Layout style={{ height: '100%' }}>

        <Sider style={{ backgroundColor: "var(--semi-color-bg-1)", width: '150px' }} >
          <div style={{
            justifyContent: "space-between",
            padding: "10px",
            textAlign: "center",
            color: "var(--semi-color-text-2)",
          }}>
            Web IDE
          </div>
          <Tree
            treeData={treeData}
            defaultExpandAll
            directory
            style={style}
          />
        </Sider>
        <Layout
          className="web-layout">
          <Content style={{
            height: 'max-content',
          }}>
            <MonacoEditor
              height={'100%'}
              language="csharp"
              theme="vs-dark"
              value={code}
              options={options}
              onChange={this.onChange}
              editorDidMount={this.editorDidMount}
            />
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
