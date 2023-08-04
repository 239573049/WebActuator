import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from 'react'

const MainLayout = lazy(() => import('./layouts/mian-layout/index'))
const Home = lazy(() => import('./pages/home/index'))

const body = document.body;
body.setAttribute('theme-mode', 'dark');

// 默认ChatAi页面，后续继续增加界面
const router = createBrowserRouter([
  {
    path: "/",
    element:
      <Suspense fallback={'加载'}>
        <MainLayout />
      </Suspense>,
    children: [
      {
        path: "",
        element: <Home />,
      }
    ],
  }
]);
function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
