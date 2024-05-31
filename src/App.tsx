import {
  RouterProvider
} from "react-router-dom";
import Layout from './pages/Layout';
import { router } from './router';

function App() {

  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  )
}

export default App
