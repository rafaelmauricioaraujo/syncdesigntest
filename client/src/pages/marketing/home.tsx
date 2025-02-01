import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { Hero } from '@/components/marketing/home/hero';


const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export function Page(): React.JSX.Element {
 
  
  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <main>
        <Hero />
      </main>
    </React.Fragment>
  );
}
