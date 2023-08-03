import React, { Component } from 'react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}
interface IState {
}

interface IProps {
  value: string;
  language: string;
}

export default class SMonaco extends Component<IProps, IState> {
    private monacoInstance: monaco.editor.IStandaloneCodeEditor | null = null;
    private containerElement: HTMLDivElement | null = null;

    constructor(props: IProps) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.initMonaco();
    }

    componentDidUpdate(prevProps: IProps) {
        if (this.props.value !== prevProps.value) {
            console.log(this.props.value);
            
            this.monacoInstance?.setValue(this.props.value);
        }

        if (this.props.language !== prevProps.language) {
            monaco.editor.setModelLanguage(this.monacoInstance?.getModel() as monaco.editor.ITextModel, this.props.language);
        }
    }

    componentWillUnmount() {
        this.destroyMonaco();
    }

    getCode(){
        return this.monacoInstance?.getValue();
    }

    setCode(code:string){
        this.monacoInstance?.setValue(code);
    }

    initMonaco() {
        const { value, language } = this.props;

        this.monacoInstance = monaco.editor.create(this.containerElement as HTMLElement, {
            value,
            language,
            // 右边缩略图
            minimap: {
                enabled: false,
            },
            theme: 'vs-dark', 
            automaticLayout: true,
        });
    }

    destroyMonaco() {
        if (this.monacoInstance) {
            this.monacoInstance.dispose();
            this.monacoInstance = null;
        }
    }

    render() {
        return (
            <div 
                ref={(element) => {this.containerElement = element;}}
                style={{ width: '100%'}}
            />
        );
    }
}
