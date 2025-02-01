import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';

// https://github.com/vitejs/vite/issues/15012#issuecomment-1825035992
function muteWarningsPlugin(warningsToIgnore: string[][]): Plugin {
  const mutedMessages = new Set();

  return {
    name: 'mute-warnings',
    enforce: 'pre',
    config: (userConfig) => ({
      build: {
        rollupOptions: {
          onwarn(warning, defaultHandler) {
            if (warning.code) {
              const muted = warningsToIgnore.find(
                ([code, message]) => code == warning.code && warning.message.includes(message)
              );

              if (muted) {
                mutedMessages.add(muted.join());
                return;
              }
            }

            if (userConfig.build?.rollupOptions?.onwarn) {
              userConfig.build.rollupOptions.onwarn(warning, defaultHandler);
            } else {
              defaultHandler(warning);
            }
          },
        },
      },
    }),
    closeBundle() {
      const diff = warningsToIgnore.filter((x) => !mutedMessages.has(x.join()));
      if (diff.length > 0) {
        this.warn('Some of your muted warnings never appeared during the build process:');
        diff.forEach((m) => this.warn(`- ${m.join(': ')}`));
      }
    },
  };
}

// See this: https://github.com/vitejs/vite/issues/15012
const warningsToIgnore = [
  ['SOURCEMAP_ERROR', "Can't resolve original location of error"],
  ['INVALID_ANNOTATION', 'contains an annotation that Rollup cannot interpret'],
];

function ignoreTsErrorsPlugin(): Plugin {
  return {
    name: 'ignore-ts-errors',
    enforce: 'pre',
    transform(code, id) {
      if (/\.tsx?$/.test(id)) {
        code = code.replace(/\/\/ @ts-expect-error/g, '');
        code = code.replace(/\/\/ @ts-ignore/g, '');
      }
      return code;
    },
  };
}

export default defineConfig({
  plugins: [
    checker({ typescript: false }),
    react(),
    muteWarningsPlugin(warningsToIgnore),
    ignoreTsErrorsPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sync Design Technologies: Technical Test',
        short_name: 'SDT: Technical Test',
        description: 'Sync Design Technologies: Technical Test',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          { src: '/public/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/public/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      injectManifest: {
        swSrc: 'public/custom-service-worker.js', // Ensure the path is correct
        },
      workbox: {
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^@\/(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
