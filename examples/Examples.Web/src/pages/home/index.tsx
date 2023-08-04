import * as React from 'react';
import SplitPane from 'react-split-pane';
import './index.css';
import SMonaco from '../../compontents/monaco';
import * as monaco from 'monaco-editor';
import { FileService } from '../../services/fileService';
import { IconTreeTriangleRight } from '@douyinfe/semi-icons';

import PubSub from 'pubsub-js'
import { Button, Spin, TabPane, Tabs } from '@douyinfe/semi-ui';

var start = false;

interface State {
    code: string;
    loading: boolean;
    output: {
        error: string;
        info: string;
    };
    fileName: string;
    assemblys: string[];
    key: string;
}
interface IProps {

}
class App extends React.Component<IProps, State> {
    file: FileService;
    monaco: React.RefObject<SMonaco> = React.createRef();
    outputRef: React.RefObject<HTMLDivElement> = React.createRef();
    constructor(props: IProps) {
        super(props);
        this.state = {
            code: "",
            loading: false,
            assemblys: [
                "System",
                "System.Buffers",
                "System.Collections",
                "System.Core",
                "System.Linq.Expressions",
                "System.Linq.Parallel",
                "mscorlib",
                "System.Linq",
                "System.Console",
                "System.Runtime",
                "System.Net.Http",
                "System.Private.CoreLib",
                "System.Console"
            ],
            key: '',
            output: {
                error: '',
                info: ''
            },
            fileName: "Program.cs"
        }

        this.file = new FileService();

        // @ts-ignore
        window.OnWriteLine = (message: any) => {
            const { output } = this.state;
            console.log(message);

            output.info += message;
            this.setState({
                output: {
                    ...output,
                    info: output.info
                }
            })
            setTimeout(() => {
                this.outputRef?.current?.scrollTo(0, this.outputRef?.current?.scrollHeight);
            }, 500);
        }

        // @ts-ignore
        window.OnDiagnostic = (message) => {
            const { output } = this.state;
            output.info += message;
            this.setState({
                output: {
                    ...output,
                    info: output.info
                }
            })
            setTimeout(() => {
                this.outputRef?.current?.scrollTo(0, this.outputRef?.current?.scrollHeight);
            }, 500);
        }

    }

    componentDidMount(): void {
        // 监听CTRL+S快捷键
        this.monaco?.current?.monacoInstance?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
            const { key } = this.state;
            if (key) {
                this.file.updateFile(key, this.monaco?.current?.getCode() || '');
                await this.runCode();
            }
        }
        );

        PubSub.subscribe('openfile', async (name: string, item: any) => {
            const value = await this.file.readFile(item.key);
            this.monaco.current?.setCode(value.fileData);
            this.setState({
                fileName: item.value,
                key: item.key,
                code: value.fileData
            });

        });
    }

    componentWillUnmount() {
        PubSub.unsubscribe('openfile');
    }

    onChange = (newValue: string) => {
        this.setState({
            code: newValue
        });
    }

    async runCode() {
        try {

            this.setState({
                loading: true
            })
            if (start === false) {
                const { assemblys } = this.state;

                const a = assemblys.map((item) => {
                    return "http://localhost:5102/assembly/" + item + ".dll";
                })
                // @ts-ignore
                await window.exportManage.SetReferences(a);
                start = true;
            }

            const code = this.monaco?.current?.getCode() || '';
            if (code === '') {
                return;
            }

            // @ts-ignore
            await window.exportManage.RunSubmission(code, false);

        } finally {

            this.setState({
                loading: false
            })
        }
    }

    render() {
        const { code, output, loading } = this.state;
        return (
            <Spin tip="编译中。。。" spinning={loading}>
                <div style={{
                    backgroundColor: "#2D2D2D",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "bold"
                }}>
                    <div style={{
                        float: "left",
                    }}>
                        <div style={{
                            height: "100%",
                            userSelect: "none",
                            width: "fit-content",
                            cursor: "pointer",
                            border: "1px solid #252526",
                            padding: "7px",
                        }}>{this.state.fileName}
                        </div>
                    </div>
                    <div style={{
                        float: "right",
                    }}>
                        <div style={{
                            height: "100%",
                            width: "fit-content",
                            padding: "5px",
                        }}>
                            <Button icon={<IconTreeTriangleRight size='small' />} onClick={() => this.runCode()} size='small'>启动</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <SplitPane style={{
                        height: "calc(100vh - 38px)",
                    }} split="horizontal"  >
                        <SMonaco ref={this.monaco} value={code} language='csharp' />
                        <div  ref={this.outputRef} style={{
                            height: "100%",
                            width: "100%",
                            overflow: "auto",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            backgroundColor: "#2D2D2D",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: "bold"
                        }}>
                            <div style={{
                                height: "100%",
                                width: "100%",
                            }}>
                                {output.info}
                            </div>
                        </div>
                    </SplitPane>
                </div>

            </Spin>
        );
    }
}

export default App;
