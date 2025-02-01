import * as React from 'react';
import { Root } from '@/root';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { setupIonicReact } from '@ionic/react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { routes } from '@/routes';

import '@ionic/react/css/core.css';

setupIonicReact();
void defineCustomElements(window);

const root = createRoot(document.getElementById('root')!);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Root>
        <Outlet />
      </Root>
    ),
    children: [...routes],
    //errorElement: null,
  },
]);
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
