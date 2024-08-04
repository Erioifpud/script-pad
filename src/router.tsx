import HomePage from '@/pages/Home';
import {
  createBrowserRouter,
} from "react-router-dom";
import EditPage from '@/pages/Edit';
import DocPage from '@/pages/Doc';
import LowCodePage from '@/pages/LowCode';
import SettingPage from '@/pages/Setting';
import RenderPage from './pages/Render';
import Layout from './pages/Layout';

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/edit",
    element: (
      <Layout>
        <EditPage />
      </Layout>
    ),
  },
  {
    path: "/doc",
    element: (
      <Layout>
        <DocPage />
      </Layout>
    ),
  },
  {
    path: "/lowcode",
    element: (
      <Layout>
        <LowCodePage />
      </Layout>
    ),
  },
  {
    path: "/setting",
    element: (
      <Layout>
        <SettingPage />
      </Layout>
    ),
  },
  {
    path: "/render",
    element: <RenderPage />,
  }
]);
