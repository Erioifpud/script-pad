import HomePage from '@/pages/Home';
import {
  createBrowserRouter,
} from "react-router-dom";
import EditPage from '@/pages/Edit';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/edit",
    element: <EditPage />,
  }
]);
