import * as React from 'react';
import SplitPane from 'react-split-pane';
import './index.css';
import SMonaco from '../../compontents/monaco';
import { FileService } from '../../services/fileService';

import PubSub from 'pubsub-js'

interface State {
    code: string;
    output: string;
    fileName: string;
}
interface IProps {

}
class App extends React.Component<IProps, State> {
    file: FileService;
    monaco: React.RefObject<SMonaco> = React.createRef();
    constructor(props: IProps) {
        super(props);
        this.state = {
            code: "",
            output: "",
            fileName: "Program.cs"
        }

        this.file = new FileService();

        PubSub.subscribe('openfile', async (name:string,item:any) => {
            
            const value = await this.file.readFile(item.key);
            this.monaco.current?.setCode(value.fileData);
            this.setState({
                fileName: name,
                code:value.fileData
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

    render() {
        const { code } = this.state;
        return (
            <SplitPane paneStyle={{
                minHeight: "calc(100vh - 300px)",
                maxHeight: "calc(100vh - 120px)",
            }} style={{
                maxHeight: "calc(100vh - 100px)",
                minHeight: "calc(100vh - 100px)",
            }} split="horizontal" size={800} >
                <SMonaco ref={this.monaco} value={code} language='csharp' />
                <div className="output-panel">
                    <span>输出面板</span>
                    <pre>{this.state.output}</pre>
                </div>
            </SplitPane>
        );
    }
}

export default App;
