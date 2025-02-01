import * as React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { Page as HomePage } from '@/pages/marketing/home';
import { Page as NotFoundPage } from '@/pages/not-found';

export const routes: RouteObject[] = [
  {
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: '/NewReport',

    lazy: async () => {
      const { Page } = await import('@/pages/new-report');
      return { Component: Page };
    },
  },
  { path: '*', element: <NotFoundPage /> },
];
