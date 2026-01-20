import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { store } from "./state/store";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles.css'
import Home from './components/Home';
import NotFound from './components/NotFound';
import About from './components/About';
import ToDo from './components/ToDo';
import Fractiles from './components/fractiles';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: '/about/:id',
    element: <About />,
  },
  {
    path: '/fractiles',
    element: <Fractiles />,
  },
  {
    path: '/todo',
    element: <ToDo />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
