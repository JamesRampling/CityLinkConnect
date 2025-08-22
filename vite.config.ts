import type express from 'express';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig, PreviewServer, ViteDevServer } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

import server from '#server/index';

// Attach an Express application to the Vite middleware stack.
function useExpress(app: express.Express) {
  return {
    name: 'use-express',
    configureServer: (server: ViteDevServer) =>
      void server.middlewares.use(app),
    configurePreviewServer: (server: PreviewServer) =>
      void server.middlewares.use(app),
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), useExpress(server)],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
