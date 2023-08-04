import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from 'react'
import Loading from './compontents/loading';

const MainLayout = lazy(() => import('./layouts/mian-layout/index'))
const Home = lazy(() => import('./pages/home/index'))

const body = document.body;
body.setAttribute('theme-mode', 'dark');

// 默认ChatAi页面，后续继续增加界面
const router = createBrowserRouter([
  {
    path: "/",
    element:
      <Suspense fallback={<Loading />}>
        <MainLayout />
      </Suspense>,
    children: [
      {
        path: "",
        element: 
        <Suspense fallback={<Loading />}>
          <Home />
        </Suspense>,
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
