import HomePage from '@/pages/Home';
import {
  createBrowserRouter,
} from "react-router-dom";
import EditPage from '@/pages/Edit';
import DocPage from '@/pages/Doc';
import LowCodePage from '@/pages/LowCode';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/edit",
    element: <EditPage />,
  },
  {
    path: "/doc",
    element: <DocPage />,
  },
  {
    path: "/lowcode",
    element: <LowCodePage />,
  },
]);
