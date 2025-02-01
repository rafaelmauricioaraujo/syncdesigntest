import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { Toaster } from '@/components/core/toaster';

const metadata: Metadata = { title: config.site.name };

interface RootProps {
  children: React.ReactNode;
}

function Root({ children }: RootProps) {
  return (
    <HelmetProvider>
      <Helmet>
        <meta content={config.site.themeColor} name="theme-color" />
        <title>{metadata.title}</title>
      </Helmet>

      <ThemeProvider>
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export { Root };
