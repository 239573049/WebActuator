import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import EditorPage from './pages/EditorPage'
import SettingsPage from './pages/SettingsPage'

// 创建占位页面组件
const SearchPage = () => <div style={{ padding: '20px', color: '#fff' }}><h1>搜索页面</h1></div>;
const SourceControlPage = () => <div style={{ padding: '20px', color: '#fff' }}><h1>源代码管理页面</h1></div>;
const DebugPage = () => <div style={{ padding: '20px', color: '#fff' }}><h1>运行和调试页面</h1></div>;

const routeConfig = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <EditorPage />
      },
      {
        path: 'editor',
        element: <EditorPage />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'source-control',
        element: <SourceControlPage />
      },
      {
        path: 'debug',
        element: <DebugPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
];

const router = createBrowserRouter(routeConfig)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
