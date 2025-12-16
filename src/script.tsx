import { createRoot } from 'react-dom/client'
import './styles.css'
import { Provider } from "react-redux";
import { store } from "./state/store";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound';
import About from './components/About';

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
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
