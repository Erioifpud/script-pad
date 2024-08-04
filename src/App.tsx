import {
  RouterProvider
} from "react-router-dom";
import { router } from './router';
import { AnimatePresence } from 'framer-motion';
import useGlobalEvents from './hooks/useGlobalEvents';

function App() {
  useGlobalEvents();

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  )
}

export default App
