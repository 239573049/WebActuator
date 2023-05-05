import './App.css';

import React, { Component } from 'react'
import { Button, Layout, Nav } from '@douyinfe/semi-ui';
import MonacoEditor from 'react-monaco-editor';

let first = true;

const { Header, Footer, Content } = Layout;

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

    return (
      <div style={{ height: '100%' }}>
        <Layout
          className="web-layout">
          <Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
            <Nav
              mode="horizontal">
              <Nav.Header>
                <span >C# Web IDE</span>
              </Nav.Header>
              <Nav.Item>
                <span >运行</span>
              </Nav.Item>
            </Nav>
          </Header>
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
              display: "flex",
              justifyContent: "space-between",
              padding: "20px",
              color: "var(--semi-color-text-2)",
            }}>尾部</Footer>
        </Layout>
      </div>
    )
  }
}
