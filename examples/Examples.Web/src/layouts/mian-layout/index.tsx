import { Component } from 'react'
import { Layout } from '@douyinfe/semi-ui';
import Navigation from '../../compontents/navigation';
import { Outlet } from 'react-router-dom'
const { Content } = Layout;

export default class index extends Component {
    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Navigation />
                <Layout>
                    <Content
                        style={{
                            backgroundColor: 'var(--semi-color-bg-0)',
                        }}>
                        <div
                            style={{
                                borderRadius: '10px',
                                height: 'max-content',
                            }}
                        >
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
