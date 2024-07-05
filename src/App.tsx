import {
  RouterProvider
} from "react-router-dom";
import Layout from './pages/Layout';
import { router } from './router';
import { AnimatePresence } from 'framer-motion';

function App() {

  return (
    <AnimatePresence mode="wait">
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </AnimatePresence>
  )
}

export default App
